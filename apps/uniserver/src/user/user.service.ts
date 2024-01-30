import { Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as crypto from 'crypto';
import { PrismaService } from '../database/prisma.service';
import excludePassword from '../utils/excludePassword';
import { UserResponse, rootEndPoint } from '@unihosp/api-interface';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private prismaService: PrismaService) {
    this.logger.debug('Initialized');
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    include?: { patient: boolean }
  ) {
    const user = await this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
      include,
    });
    if (!user) return null;

    user.avatarUrl = rootEndPoint + user.avatarUrl;
    return user;
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserResponse[]> {
    const response = await this.prismaService.user.findMany({
      ...params,
      include: {
        patient: true,
        doctor: true,
        Avatars: true,
        History: true,
        preferences: true,
        refreshTokens: true,
      },
    });
    return response.map((user) => excludePassword(user, ['password']));
  }

  async usersAddAuthToken(userId: string, refreshToken: string) {
    const expireIn = 2592000000;
    return this.prismaService.refreshTokens.create({
      data: {
        authToken: Buffer.from(refreshToken, 'utf-8'),
        expireIn: new Date(Date.now() + expireIn),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async removeAuthToken(refreshTokenId: string) {
    this.logger.log(refreshTokenId);
    return this.prismaService.refreshTokens
      .delete({
        where: {
          id: refreshTokenId,
        },
      })
      .catch((err) => ({
        reason: err,
        statusCode: 401,
      }));
  }

  async refreshTokens(userId: string) {
    return this.prismaService.refreshTokens.findMany({ where: { userId } });
  }

  async createUser(data: Prisma.UserCreateInput) {
    try {
      const user = await this.prismaService.user.create({ data });
      return excludePassword(user, ['password']);
    } catch (err) {
      this.logger.debug(err.message);
    }
  }

  async verifyMailAndContact(email: string, contact: string) {
    try {
      await this.prismaService.verificationMailRequest.deleteMany({
        where: {
          OR: [{ email }, { contact }],
        },
      });
      const mailCreate =
        await this.prismaService.verificationMailRequest.create({
          data: {
            id: crypto.randomBytes(64).toString('hex'),
            expireAt: new Date(Date.now() + 600000),
            code: Math.round(Math.random() * 1000000),
            contact,
            email,
          },
        });
      this.logger.debug(JSON.stringify(mailCreate));
      return {
        uri: mailCreate.id,
        code: mailCreate.code,
      };
    } catch (err) {
      this.logger.debug(err.message);
    }
  }

  getAndDeleteVerifyMailById(id: string) {
    return this.prismaService.verificationMailRequest.delete({
      where: {
        id,
      },
    });
  }

  getAndDeleteVerifyMailByEmail(email: string) {
    return this.prismaService.verificationMailRequest.delete({
      where: {
        email: email,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prismaService.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.delete({
      where,
    });
  }
}
