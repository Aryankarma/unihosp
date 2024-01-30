import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { MailService } from './mail/mail.service';
import { AuthService } from './services/auth.service';
import { UserService } from '../user/user.service';
import { LogToDbService } from '../log-to-db/log-to-db.service';
import { AppAccessGuard } from '../guards/app-access.guard';

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
    private dbLogger: LogToDbService
  ) {}

  private logger = new Logger(AuthController.name);

  @Post('signup')
  async signup(@Body() signUpData: cSignUpData) {
    return this.authService.signup(signUpData);
  }

  @Post('v/:id')
  @Redirect()
  async verifyCode(
    @Param('id') id: string,
    @Body() { otpCode }: { otpCode: number }
  ) {
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

      this.logger.debug(
        `Mail ${mail.email}  is Verified With Code: ${mail.id}`
      );
      this.dbLogger.log(
        `Mail ${mail.email}  is Verified With Code: ${mail.id}`
      );
      this.logger.debug(
        `Email Verified using OTP: ${update.email} = ${update.verified}`
      );
      this.dbLogger.log(
        `Email Verified using OTP: ${update.email} = ${update.verified}`
      );

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
    @Query('vc') verifyCode: string
  ) {
    this.logger.debug('Verifying Mail');
    try {
      const mail = await this.userService.getAndDeleteVerifyMailById(
        verifyCode
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
  async login(
    @Body() data: { email: string; password: string },
    @Res() res: Response
  ) {
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
        message: 'Authentication Failed',
        data: null,
      });
      return;
    }

    res.cookie('accessToken', response.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 2000 * 60 * 60 * 24 * 7),
      secure: true,
      sameSite: 'strict',
    });
    res.send({
      message: 'Authentication Successful',
      data: {
        user: response.user,
      },
    });
  }

  @Get('accesstoken')
  getAccessToken(@Req() req: Request) {
    console.log(req.cookies['refreshToken']);
    const authorization = req.cookies['refreshToken'];
    try {
      return this.authService.generateFromToken(authorization);
    } catch (err) {
      this.logger.error(err);
      return err;
    }
  }

  @Delete('logout')
  async asdeleteRefreshToken(@Req() req: Request, @Res() res: Response) {
    this.logger.log("Deleting User's Refresh Token");
    try {
      const refreshTokenId = req.cookies['refreshToken'];
      res.cookie('accessToken', '', {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite: 'strict',
      });

      res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite: 'strict',
      });
      console.log(refreshTokenId);

      const result = await this.authService.deleteRefreshToken(refreshTokenId);
      console.log(result);
      if (result) {
        return res.send({
          message: 'Logout Successful',
          success: true,
        });
      }
      throw new Error('Logout Failed');
    } catch (err) {
      return res.send({
        message: err.message,
        success: false,
      });
    }
  }

  // @Post('msg')
  // sendTestMessage(@Body() data: { phoneNumber: string; message: string }) {
  //   return this.msgService.sendTestMessage(data.phoneNumber, data.message);
  // }

  @Post('testmail')
  sendTestMail(@Body() data: { recepient: string; username: string }) {
    return this.mailService.sendMail(
      data.recepient,
      data.username,
      'Unknown',
      123423
    );
  }

  @Post('exists')
  async doesExists(@Body() data: { email?: string }) {
    const { email } = data;

    type ResponseType = {
      error: string | null;
      email: boolean;
      handle: boolean;
    };

    const toCheck = email ? ToCheckType.Email : null;
    let response: ResponseType | null = null;

    switch (toCheck) {
      case ToCheckType.Email:
        if (await this.userService.user({ email })) {
          console.log(await this.userService.user({ email }));
          response = {
            email: true,
            handle: false,
            error: null,
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
