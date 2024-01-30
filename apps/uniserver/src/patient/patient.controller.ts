import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { PatientGuard } from './guard/patient.guard';
import { PatientService } from './service/patient.service';
import { Request } from 'express';
import { AccessTokenGuard } from '../guards/accesstoken.guard';
import { AuthService } from '../authentication/services/auth.service';

interface PatientDeleteInput {
  handle?: string;
  id?: string;
}

interface AddToAllowedPatientUserInput {
  type: 'Hospital' | 'Doctor';
  patientHandle?: string;
  hospitalHandle?: string;
  doctorHandle?: string;
}

@Controller('patient')
@UseGuards(AccessTokenGuard)
@UseGuards(PatientGuard)
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private authService: AuthService
  ) {}

  @Get()
  findPatient(@Body() data: Prisma.PatientWhereUniqueInput) {
    return this.patientService.findPatientProfile({
      userId: data.userId,
      id: data.id,
      handle: data.handle,
    });
  }

  @Get('/user')
  async getPatientByUserID(@Req() req: Request) {
    const user: User = req.body['user'];
    return this.patientService.findPatientProfile({
      userId: user.id,
    });
  }

  @Get('/search')
  findAllPatient(@Body('query') query: string) {
    return this.patientService.findPatientProfiles({
      handle: query,
    });
  }

  @Post('exists')
  exists(@Body() data: { handle: string }) {
    return this.patientService.exists(data.handle);
  }

  @Post()
  createPatientProfile(
    @Req() req: Request,
    @Body() data: Prisma.PatientCreateInput
  ) {
    const user: User = req.body['user'];
    console.log(user);
    return this.patientService.createPatientProfile({
      ...data,
      ownerId: user.id,
    });
  }

  @Put()
  addToAllowedList(@Body() data: AddToAllowedPatientUserInput) {
    switch (data.type) {
      case 'Hospital':
        return this.patientService.updatePatientProfile(
          {
            handle: data.patientHandle,
          },
          {
            allowedHospitals: {
              connect: {
                handle: data.hospitalHandle,
              },
            },
          }
        );
      case 'Doctor':
        return this.patientService.updatePatientProfile(
          {
            handle: data.patientHandle,
          },
          {
            allowedHospitals: {
              connect: {
                handle: data.doctorHandle,
              },
            },
          }
        );
    }
  }

  @Delete()
  deletePatientProfile(@Body() data: PatientDeleteInput) {
    return this.patientService.deleteProfile({
      id: data.id,
      handle: data.handle,
    });
  }
}
