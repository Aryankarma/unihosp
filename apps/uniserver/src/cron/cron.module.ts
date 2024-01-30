import { Module } from '@nestjs/common';

import { RunCronJobs } from './RunCronJobs';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [RunCronJobs, PrismaService]
})
export class CronModule { }
