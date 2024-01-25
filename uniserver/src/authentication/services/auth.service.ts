import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { createHash } from 'crypto';

import { TokenType } from 'src/interfaces';
import { UserService } from 'src/user/user.service';
import excludePassword from 'src/utils/excludePassword';
import { MailService } from '../mail/mail.service';
import { MSGService } from './msg.service';

interface LoginResponse {
  accessToken: string,
  refreshToken: string,
  refreshTokenId: string,
  user: Omit<User, "password">
}
@Injectable({})
export class AuthService {

  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private msgService: MSGService
  ) {
  }


  private logger = new Logger(AuthService.name);



  async login(authData: { email: string, password: string }): Promise<LoginResponse> {

    let user = await this.userService.user({ email: authData.email });
    this.logger.log(JSON.stringify(user))
    authData.password = this.hash(authData.password)

    if (!user) return null;

    if (user.password !== authData.password) {
      return null;
    }

    const userDetailsWithoutPassword = excludePassword(user, ['password'])

    this.logger.log(JSON.stringify(userDetailsWithoutPassword));

    const detailsToCreateToken = { id: userDetailsWithoutPassword.id, email: userDetailsWithoutPassword.email };

    const accessToken = this.generateToken(detailsToCreateToken);
    const refreshToken = this.generateToken(detailsToCreateToken, TokenType.RefreshToken);
    const refreshTokenSaved = await this.userService.usersAddAuthToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      refreshTokenId: refreshTokenSaved.id,
      user: userDetailsWithoutPassword
    }
  }



  async generateFromToken(authorization: string) {
    // const receivedToken = this.splitAuthToken(authorization);
    const receivedToken = authorization;
    const user = this.jwtService.verify(receivedToken);

    const userId = user.id;

    const refreshTokens = await this.userService.refreshTokens(userId);

    if (refreshTokens.findIndex((value) => value.authToken.toString("utf-8") === receivedToken) > -1) {
      return { accessToken: this.generateToken(await this.userService.user({ id: userId })), message: "AuthToken Regeneration Successfull" };
    }

    return { statusCode: 403, message: "Wrong Refresh Token" }
  }

  deleteRefreshToken(refreshTokenId: string) {
    return this.userService.removeAuthToken(refreshTokenId);
  }

  private generateToken(user: any, tokenType: TokenType = TokenType.AccessToken) {
    this.logger.debug(`Access token expire: ${this.configService.get('ACCESS_TOKEN_EXPIRATION')}`);
    this.logger.debug(`Refresh token expire: ${this.configService.get('REFRESH_TOKEN_EXPIRATION')}`);
    switch (tokenType) {
      case TokenType.AccessToken:
        return this.jwtService.sign(user, {
          expiresIn: parseInt(this.configService.get('ACCESS_TOKEN_EXPIRATION'))
        })
      case TokenType.RefreshToken:
        return this.jwtService.sign(user, {
          expiresIn: parseInt(this.configService.get('JWT_REFRESH_EXPIRE'))
        })
    }
  }

  async signup(signUpData: Prisma.UserCreateInput) {
    this.logger.debug(`Signing Up: ${JSON.stringify(signUpData)}`);

    try {
      if (!/^\d{10}$/.test(signUpData.contact)) {
        return {
          statusCode: 403,
          message: 'Wrong Contact details',
        };
      }

      const id = await this.userService.verifyMailAndContact(
        signUpData.email,
        signUpData.contact,
      );

      // const response = await this.mailService.sendMail(
      //   signUpData.email,
      //   signUpData.email,
      //   id.uri,
      //   id.code,
      // );
      //
      // if (signUpData.contact) {
      // const message = await this.msgService.sendMessage(
      //   signUpData.contact,
      //   id.code,
      // );
      // this.logger.debug(`MessageSent: ${JSON.stringify(message)}`);
      // }

      // this.logger.debug(`MailSent: ${JSON.stringify(response)}`);

      signUpData.password = this.hash(signUpData.password);
      const user = await this.userService.createUser(signUpData);
      this.logger.log(JSON.stringify(user));
      return { ...user, otpVerificationCode: id.uri };
    } catch (err) {
      return {
        message: 'Something Went wrong please try again later',
      }
    }
  }


  private hash(input: string) {
    return createHash("sha256").update(input).digest().toString("hex");
  }

  verify(authorization: string): { user: User } {
    const accessToken = this.splitAuthToken(authorization);
    try {
      let result = this.jwtService.verify(accessToken);
      return { user: result }
    } catch (error) {
      return { ...error, user: null }
    }
  }

  private isCorrectBearer(bearer: string) {
    this.logger.log(`Bearer: ${this.configService.get('BEARER')}`)
    return this.configService.get('BEARER') === bearer;
  }

  private splitAuthToken(authorization: string) {
    const auth = authorization.split(' ');
    if (auth.length !== 2)
      throw { errorCode: 401, message: 'Access Token Not found' };
    const [bearer, token] = auth;
    if (!this.isCorrectBearer(bearer)) {
      throw { errorCode: 401, message: 'Wrong Bearer' };
    }
    return token;
  }
}
