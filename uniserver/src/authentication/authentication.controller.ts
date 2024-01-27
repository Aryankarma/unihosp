import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Role, User } from '@prisma/client';
import { Request, Response } from 'express';
import { AccessTokenGuard } from 'src/guards/accesstoken.guard';
import { AppAccessGuard } from 'src/guards/app-access.guard';
import { DevelopmentGuard } from 'src/guards/development.guard';
import { LogToDbService } from 'src/log-to-db/log-to-db.service';
import { UserService } from 'src/user/user.service';
import { MailService } from './mail/mail.service';
import { AuthService } from './services/auth.service';
import { MSGService } from './services/msg.service';

enum ToCheckType {
  Email,
  Handle,
}

interface cSignUpData {
  email: string;
  password: string;
  contact: string;
  role?: Role;
}

@Controller('auth')
@UseGuards(AppAccessGuard)
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
    private msgService: MSGService,
    private dbLogger: LogToDbService,
  ) { }

  private logger = new Logger(AuthController.name);

  @Post('signup')
  async signup(@Body() signUpData: cSignUpData) {
    return this.authService.signup(signUpData);
  }

  @Post('v/:id')
  @Redirect()
  async verifyCode(@Param('id') id: string, @Body() { otpCode }: { otpCode: number }) {
    this.logger.debug('Verifying OTP');
    try {
      const mail = await this.userService.getAndDeleteVerifyMailById(id);

      if (mail.code !== otpCode) {
        return {
          statusCode: 403,
          message: "OTP doesn't match",
        };
      }

      const update = await this.userService.updateUser({
        where: {
          email: mail.email,
        },
        data: {
          verified: true,
          updatedAt: new Date(),
        },
      });

      this.logger.debug(`Mail ${mail.email}  is Verified With Code: ${mail.id}`);
      this.dbLogger.log(`Mail ${mail.email}  is Verified With Code: ${mail.id}`);
      this.logger.debug(`Email Verified using OTP: ${update.email} = ${update.verified}`);
      this.dbLogger.log(`Email Verified using OTP: ${update.email} = ${update.verified}`);

      return {
        uri: 'http://localhost:4200',
      };
    } catch (err) {
      return err;
    }
  }

  @Get('verify')
  @Redirect()
  async verifyMail(
    @Query('redirectURL') redirectURI: string,
    @Query('vc') verifyCode: string,
  ) {
    this.logger.debug('Verifying Mail');
    try {
      const mail = await this.userService.getAndDeleteVerifyMailById(
        verifyCode,
      );
      const update = await this.userService.updateUser({
        where: {
          email: mail.email,
        },
        data: {
          verified: true,
          updatedAt: new Date(),
        },
      });
      this.logger.debug(`Mail ${mail.email} is Verified With Code: ${mail.id}`);
      this.logger.debug(`Email Verified: ${update.email} = ${update.verified}`);
      return {
        url: redirectURI,
      };
    } catch (e) {
      return e;
    }
  }

  @Post('login')
  async login(@Body() data: { email: string; password: string }, @Res() res: Response, @Req() req: Request) {
    console.log(data);

    if (!/\w*@\w*.\w*/.test(data.email)) {
      return {
        statusCode: 406,
        message: 'Please provide correct email Address',
      };
    }
    const response = await this.authService.login(data);
    if (!response) {
      res.status(401);
      res.send({
        message: "Authentication Failed",
        data: null
      });
    }

    this.logger.log("Request Secure: ", req.secure, req.headers["x-forwarded-proto"] === "https");

    res.cookie("accessToken", response.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      secure: true,
      sameSite: "strict"
    });
    res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 2000 * 60 * 60 * 24 * 7),
      secure: true,
      sameSite: "strict"
    });
    res.send({
      message: "Authentication Successful",
      data: {
        user: response.user,
      }
    })
  }

  @Get('accesstoken')
  getAccessToken(@Req() req: Request) {

    console.log(req.cookies["refreshToken"])
    const authorization = req.cookies["refreshToken"];
    try {
      return this.authService.generateFromToken(authorization);
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }

  @Delete('logout')
  deleteRefreshToken(@Body('refreshTokenId') refreshTokenId: string) {
    console.log(refreshTokenId);
    return this.authService.deleteRefreshToken(refreshTokenId);
  }


  @Post('msg')
  sendTestMessage(@Body() data: { phoneNumber: string; message: string }) {
    return this.msgService.sendTestMessage(data.phoneNumber, data.message);
  }

  @Post('testmail')
  sendTestMail(@Body() data: { recepient: string; username: string }) {
    return this.mailService.sendMail(
      data.recepient,
      data.username,
      'Unknown',
      123423,
    );
  }

  @Post('exists')
  async doesExists(@Body() data: { email?: string }) {
    const { email } = data;

    const toCheck = email ? ToCheckType.Email : null;
    let response: any;

    switch (toCheck) {
      case ToCheckType.Email:
        if (await this.userService.user({ email })) {
          console.log(await this.userService.user({ email }));
          response = {
            email: true,
          };
        }
        break;
      default:
        return {
          error: '401',
          email: false,
          handle: false,
        };
    }

    return response
      ? response
      : {
        error: '401',
        email: false,
        handle: false,
      };
  }
}
