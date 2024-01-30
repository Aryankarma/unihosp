import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DoctorService {
  logger = new Logger(DoctorService.name);

  constructor(private prismaService: PrismaService) {}

  addDoctor(
    data: { fName: string; lName: string; handle: string },
    hospitalHandle: string,
    userId: string
  ) {
    const { fName, lName, handle } = data;
    return this.prismaService.doctor.create({
      data: {
        fName: fName,
        lName: lName,
        handle: handle + hospitalHandle,
        owner: {
          connect: {
            id: userId,
          },
        },
        hospital: {
          connect: {
            handle: hospitalHandle,
          },
        },
      },
    });
  }

  async getDoctorById(input: Prisma.DoctorWhereUniqueInput) {
    try {
      const result = await this.prismaService.doctor.findUnique({
        where: input,
        include: {
          owner: true,
          allowedPatientProfiles: true,
          Appointments: true,
          hospital: true,
          notification: true,
        },
      });

      console.log(result);
      return result;
    } catch (reason) {
      console.log(reason);
      return {
        message: reason,
      };
    }
  }

  async updateDoctor(
    handle: string,
    data: { fName?: string; lName?: string; handle?: string }
  ) {
    return this.prismaService.doctor
      .update({
        where: { handle },
        data,
      })
      .catch((reason: unknown) => ({ message: reason, statusCode: 401 }));
  }

  private async doctorExists(data: { id?: string; handle?: string }) {
    const doctor = await this.prismaService.doctor.findUnique({
      where: {
        id: data.id!,
        handle: data.handle!,
      },
    });
    if (doctor) return { status: true, doctor };
    else return { status: false, doctor: undefined };
  }

  async updateHospital(handle: string, data: { hospitalHandle: string }) {
    if ((await this.doctorExists({ handle })).status) {
      return this.prismaService.doctor.update({
        where: { handle },
        data: {
          hospital: {
            connect: {
              handle: data.hospitalHandle,
            },
          },
        },
      });
    }
  }

  async addToAllowedList(handle: string) {
    return this.prismaService.doctor
      .update({
        where: { handle },
        data: {
          allowedPatientProfiles: {
            connect: {
              handle,
            },
          },
        },
      })
      .catch((reason: unknown) => ({
        message: reason,
        statusCode: 401,
      }));
  }

  async removeFromAllowedList(handle: string) {
    return this.prismaService.doctor
      .update({
        where: { handle },
        data: {
          allowedPatientProfiles: {
            disconnect: {
              handle,
            },
          },
        },
      })
      .catch((reason: unknown) => ({
        message: reason,
        statusCode: 401,
      }));
  }

  private async deleteById(id: string) {
    try {
      return await this.prismaService.doctor.delete({
        where: {
          id,
        },
      });
    } catch (reason) {
      return {
        message: reason,
        statusCode: 401,
      };
    }
  }

  private async deleteByHandle(handle: string) {
    return this.prismaService.doctor
      .delete({
        where: {
          handle,
        },
      })
      .catch((reason: unknown) => ({
        message: reason,
        statusCode: 401,
      }));
  }

  deleteDoctor(data: { handle?: string; id?: string }) {
    try {
      if (data.handle) return this.deleteByHandle(data.handle);
      if (data.id) return this.deleteById(data.id);
    } catch (error) {
      return { error: 501, statusMessage: error.message };
    }
  }
}
