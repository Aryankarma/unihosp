import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SearchService {

  logger = new Logger(SearchService.name)

  constructor(private prisma: PrismaService) { }

  private async queryForDoctors(query: string) {
    const doctors = await this.prisma.doctor.findMany({
      where: {
        OR: [
          { fName: { startsWith: query } },
          { lName: { startsWith: query } },
          { handle: { startsWith: query } }
        ]
      },
      select: {
        id: true,
        fName: true,
        lName: true,
        handle: true,
      }
    });

    // if (doctors.length < 5) {
    //   this.logger.debug(`Doctor length: ${doctors.length}`)
    //   const ifContains = await this.prisma.doctor.findMany({
    //     where: {
    //       OR: [
    //         { fName: { contains: query } },
    //         { lName: { contains: query } },
    //         { handle: { contains: query } }
    //       ]
    //     },
    //     select: {
    //       id: true,
    //       fName: true,
    //       lName: true,
    //       handle: true,
    //     }
    //   });
    //   doctors.push(...ifContains);
    // }

    return doctors.map((doctor) => ({
      handle: doctor.handle,
      type: 'Doctor',
      name: `${doctor.fName} ${doctor.lName}`
    }));
  }

  private async queryForHospitals(query: string) {
    const hospitals = await this.prisma.hospital.findMany({
      where: {
        OR: [
          { handle: { startsWith: query } },
          { location: { startsWith: query } },
          { name: { startsWith: query } }
        ]
      },
      select: {
        id: true,
        name: true,
        location: true,
        handle: true
      }
    });

    // if (hospitals.length < 5) {
    //   const ifContains = await this.prisma.hospital.findMany({
    //     where: {
    //       OR: [
    //         { name: { contains: query } },
    //         { location: { contains: query } },
    //         { handle: { contains: query } }
    //       ]
    //     },
    //     select: {
    //       id: true,
    //       name: true,
    //       location: true,
    //       handle: true
    //     }
    //   });
    //   hospitals.push(...ifContains);
    // }

    return hospitals.map((hospital) => ({
      handle: hospital.handle,
      name: hospital.name,
      location: hospital.location,
      type: 'Hospital',
    })).slice(0, 5);
  }

  private async queryForPatients(query: string) {
    const patients = await this.prisma.patient.findMany({
      where: {
        OR: [
          { fName: { contains: query } },
          { lName: { contains: query } },
          { handle: { contains: query } }
        ]
      },
      select: {
        id: true,
        fName: true,
        lName: true,
        handle: true,
      },
    });

    // if (patients.length < 5) {
    //   const ifContain = await this.prisma.patient.findMany({
    //     where: {
    //       handle: { contains: query },
    //       fName: { contains: query },
    //       lName: { contains: query },
    //     },
    //     select: {
    //       id: true,
    //       fName: true,
    //       lName: true,
    //       handle: true,
    //     }
    //   })
    //   patients.push(...ifContain);
    // }

    return patients.map(patient => ({
      type: 'Patient',
      name: patient.fName + " " + patient.lName,
      handle: patient.handle
    })).slice(0, 5);
  }

  async query(query: string) {
    const doctors = this.queryForDoctors(query);
    const hospitals = this.queryForHospitals(query);
    const patients = this.queryForPatients(query);
    console.log(await doctors, await patients, await hospitals)

    return [...(await doctors), ...(await hospitals), ...(await patients)];
  }
}
