import { Injectable, Logger } from '@nestjs/common';
import { Avatars } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AvatarsService {

  private logger = new Logger();

  constructor(private readonly prismaService: PrismaService) { }

  async uploadAvatar(name: string, userId: string, imageData: Buffer, type: string) {
    try {
      const avatar = await this.prismaService.avatars.findUnique({
        where: {
          userId: userId
        }
      });
      let resp: Avatars;
      if (!avatar) {
        resp = await this.prismaService.avatars.create({
          data: {
            name: name.toLowerCase().replace(/[-\s]/, ""),
            data: imageData,
            type: type,
            user: {
              connect: {
                id: userId
              }
            }
          }
        })
      } else {
        resp = await this.prismaService.avatars.update({
          where: {
            userId: userId,
          }, data: {
            name: name,
            type: type,
            data: imageData,
            updatedAt: new Date()
          }
        })
      }
      const update = await this.prismaService.user.update({
        where: { id: userId },
        data: { avatarUrl: `/avatars/${resp.model}/${resp.name}` }
      })

      return {
        url: update.avatarUrl,
        message: "Upload Successfull"
      }

    } catch (err) {
      console.log(err);
      return {
        message: 'Upload was not successfull',
        err
      }
    }
  }

  getAvatarObject(id: string) {
    return this.prismaService.avatars.findUnique({
      where: {
        model: id
      }
    })
  }

}
