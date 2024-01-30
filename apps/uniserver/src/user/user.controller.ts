import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';

import { User } from '@prisma/client';
import { AccessTokenGuard } from '../guards/accesstoken.guard';

enum ToCheckType {
  Email,
  Handle,
}

@Controller({
  path: 'user',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getCurrentUser(@Req() req: Request) {
    const user: User = req.body['user'];
    return this.userService.user(
      {
        id: user.id,
      },
      {
        patient: true,
      }
    );
  }

  @Post('exists')
  async doesExists(@Body() data: { email?: string }) {
    const { email } = data;

    const toCheck = email ? ToCheckType.Email : null;
    type ResponseType = {
      error?: string;
      email: boolean;
      handle: boolean;
    };
    let response: ResponseType | null = null;

    switch (toCheck) {
      case ToCheckType.Email:
        if (await this.userService.user({ email })) {
          console.log(await this.userService.user({ email }));
          response = {
            email: true,
            handle: false,
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

  @Post('users')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAllUsers(@Body() data: any) {
    return this.userService.users({ ...data });
  }
}
