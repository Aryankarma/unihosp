import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppAuthentication } from './app.auth.service';
import { AuthController } from './authentication/authentication.controller';
import { MailService } from './authentication/mail/mail.service';
import { AuthService } from './authentication/services/auth.service';
import { AvatarsController } from './avatars/avatars.controller';
import { AvatarsService } from './avatars/avatars.service';
import { CronModule } from './cron/cron.module';
import { PrismaService } from './database/prisma.service';
import { DoctorController } from './doctor/doctor.controller';
import { DoctorService } from './doctor/service/doctor.service';
import { DevelopmentGuard } from './guards/development.guard';
import { HospitalGuard } from './hospital/guard/hospital.guard';
import { HospitalController } from './hospital/hospital.controller';
import { HospitalService } from './hospital/services/hospital.service';
import { LogToDbService } from './log-to-db/log-to-db.service';
import { PatientController } from './patient/patient.controller';
import { PatientService } from './patient/service/patient.service';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { ChattingGateway } from './socketServices/chatting/chatting.gateway';
import { ChatService } from './socketServices/chatting/service/chat.service';
import { NotifierGateway } from './socketServices/notifier/notifier.gateway';
import { NotifierService } from './socketServices/notifier/service/notifier.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { EController } from './e/e.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('PRIVATE_TOKEN_KEY'),
        signOptions: {
          expiresIn: parseInt(configService.get('JWT_REFRESH_EXPIRE')!),
        },
      }),
      inject: [ConfigService],
    }),
    CronModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 30,
        },
      ],
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    PatientController,
    HospitalController,
    AvatarsController,
    DoctorController,
    SearchController,
    EController,
  ],
  providers: [
    PrismaService,
    AuthService,
    DevelopmentGuard,
    PatientService,
    UserService,
    MailService,
    HospitalGuard,
    HospitalService,
    NotifierGateway,
    NotifierService,
    AvatarsService,
    LogToDbService,
    DoctorService,
    AppAuthentication,
    SearchService,
    ChatService,
    ChattingGateway,
  ],
})
export class AppModule implements OnModuleDestroy {
  constructor() {}
  async onModuleDestroy() {
    // await this.msgService.sendAppMessage('Hello Boss, I guess something went wrong with app, it\'s going off.');
  }
}
