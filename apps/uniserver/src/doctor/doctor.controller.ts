import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DoctorService } from './service/doctor.service';
import { AppAccessGuard } from '../guards/app-access.guard';

@Controller('doctor')
// @UseGuards(DevelopmentGuard)
@UseGuards(AppAccessGuard)
export class DoctorController {
  private logger = new Logger(DoctorController.name);

  constructor(private doctorService: DoctorService) {
    this.logger.debug('Created');
  }

  @Post()
  createDoctor(
    @Body()
    data: Prisma.DoctorCreateInput & { hospitalHandle: string; userId: string }
  ) {
    return this.doctorService.addDoctor(
      {
        fName: data.fName,
        lName: data.lName,
        handle: data.handle,
      },
      data.hospitalHandle,
      data.userId
    );
  }

  @Get()
  getDoctor(@Body() input: Prisma.DoctorWhereUniqueInput) {
    return this.doctorService.getDoctorById(input);
  }
}
