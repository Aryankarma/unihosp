import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { UserProfileResponse } from '@unihosp/api-interface';

// enum BloodGroupType {
//   'A+',
//   'A-',
//   'B+',
//   'B-',
//   'O+',
//   'O-',
// }

@Injectable()
export class PatientService {
  private logger = new Logger(PatientService.name);

  constructor(private prismaService: PrismaService) {
    this.logger.debug(`Initialized`);
  }

  async createHandle(fName: string, lName: string): Promise<string> {
    const generated =
      fName.slice(-3) +
      lName.slice(-3) +
      `${Math.round(Math.random() * 100)}@unihosp`;
    const alreadyThere = await this.prismaService.patient.findUnique({
      where: { handle: generated },
    });
    if (alreadyThere) {
      return this.createHandle(fName, lName);
    }
    return generated;
  }

  async createPatientProfile(
    newProfileData: Prisma.PatientCreateInput & { ownerId: string }
  ) {
    const { fName, lName, ownerId, handle, dateOfBirth, bloodGroup } =
      newProfileData;
    await this.prismaService.user.update({
      where: { id: ownerId },
      data: {
        name: fName + ' ' + lName,
      },
    });

    return this.prismaService.patient
      .create({
        data: {
          fName,
          lName,
          dateOfBirth: new Date(dateOfBirth!),
          bloodGroup,
          handle:
            handle && handle !== ''
              ? `${handle}@unihosp`
              : await this.createHandle(fName, lName),
          owner: {
            connect: {
              id: ownerId,
            },
          },
        },
      })
      .catch((err: unknown) => {
        return { err: 401, errMessage: err, message: 'Profile Already Exists' };
      });
  }

  async exists(handle?: string) {
    if (!handle) return { error: '401', email: false };

    if (
      /\w*@\w*/.test(handle) &&
      (await this.prismaService.patient.findUnique({ where: { handle } }))
    ) {
      return {
        message: 'Handle Available',
        handle: true,
      };
    }

    return {
      error: '401',
      email: false,
    };
  }

  async findPatientProfile(data: {
    id?: string;
    handle?: string;
    userId?: string;
  }): Promise<UserProfileResponse | null> {
    this.logger.debug('Patient ID: ' + JSON.stringify(data));
    const profile = await this.prismaService.patient.findUnique({
      where: {
        id: data.id,
        handle: data.handle,
        userId: data.userId,
      },
      include: {
        allowedDoctors: true,
        allowedHospitals: true,
        owner: false,
        Appointments: true,
      },
    });
    if (!profile) return null;
    return profile as UserProfileResponse;
  }

  findPatientProfiles(data: { handle?: string }) {
    return this.prismaService.patient.findMany({
      where: {
        handle: { contains: data.handle },
      },
    });
  }

  allowDoctorPatientProfile(handle: string, doctorId: string) {
    return this.prismaService.patient.update({
      where: {
        handle,
      },
      data: {
        allowedDoctors: {
          connect: [{ id: doctorId }],
        },
      },
    });
  }

  allowHospitalPatientProfile(handle: string, hospitalId: string) {
    return this.prismaService.patient.update({
      where: {
        handle,
      },
      data: {
        allowedHospitals: {
          connect: [
            {
              id: hospitalId,
            },
          ],
        },
      },
    });
  }

  updatePatientProfile(
    input: Prisma.PatientWhereUniqueInput,
    data: Prisma.PatientUpdateInput
  ) {
    return this.prismaService.patient.update({
      where: input,
      data: data,
    });
  }

  deleteProfile(data: { handle?: string; id?: string }) {
    if (data.handle)
      return this.prismaService.patient.delete({
        where: {
          id: data.id,
        },
      });
    else
      return this.prismaService.patient.delete({
        where: {
          handle: data.handle,
        },
      });
  }
}
