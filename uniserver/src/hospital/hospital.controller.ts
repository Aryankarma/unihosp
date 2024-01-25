import { Body, Controller, Delete, Get, Logger, Patch, Post, Query, UseGuards } from '@nestjs/common';
import Roles from './metadata/roles.metadata';
import { HospitalService } from './services/hospital.service';
import { Hospital, Prisma } from '@prisma/client';
import { CreateHospitalInput, CreateMultipleHospitalInput } from 'src/interfaces/hospital';


@Roles('Admin')
@Controller('hospital')
export class HospitalController {

  private logger = new Logger(HospitalController.name);

  constructor(private hospitalService: HospitalService) { }

  @Post()
  createHospital(@Body() data: CreateHospitalInput) {
    return this.hospitalService.createOneHospital({
      ...data,
      handle: data.handle || this.generateHandle(data.name)
    })
  }

  @Post("/multi")
  createHospitals(@Body() data: CreateMultipleHospitalInput) {
    return this.hospitalService.createManyHospital(data);
  }

  @Patch()
  updateHospital() { }

  @Get()
  async getHospital(@Body() data?: { id?: string, handle?: string }, @Query("q") query?: string) {
    console.log(data, query)
    try {
      if (Object.keys(data).length > 0) {
        const result = await this.hospitalService.getHospitalById({ id: data.id, handle: data.handle })
        return {
          hospital: result
        }
      }
      this.logger.debug(`Query: ${query}`);
      if (query)
        return this.hospitalService.getHospitals({
          OR: [
            {
              handle: { contains: query }
            },
            {
              name: { contains: query }
            },
            {
              location: { contains: query }
            }
          ]
        })
      else
        return this.hospitalService.getHospitals({});
    } catch (err) {
      return {
        "message": "something went wrong"
      }
    }
  }

  private generateHandle(name: string): string {
    const splittedName = name.split(" ");
    let handle = "";
    for (const words of splittedName) {
      handle += words[0]
    }
    return "@" + handle.toLowerCase();
  }


  @Delete()
  deleteHospitalById(@Body('hospitalId') hospitalId: string) {
    return this.hospitalService.deleteHospitalById(hospitalId);
  }

}
