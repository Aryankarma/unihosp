import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RunCronJobs implements OnModuleInit {

  logger = new Logger(RunCronJobs.name);

  constructor(private prismaService: PrismaService) {
    this.deleteJob = this.deleteJob.bind(this)
  }
  interval: NodeJS.Timer;
  async onModuleInit() {
    this.logger.log(`Cron Job Service Started at: ${new Date().toISOString()}`);
    this.interval = setInterval(
      this.deleteJob,
      86400000
    );
  }

  async deleteJob() {
    this.logger.debug(`Deleting RefreshToken at: ${new Date().toISOString()}`)

    console.log(await this.prismaService.refreshTokens.deleteMany({
      where: {
        expireIn: {
          gt: new Date(),
        },
      },
    }));
  }
}
