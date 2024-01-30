import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class NotifierService {
  private readonly logger = new Logger(NotifierService.name);

  constructor(private prismaService: PrismaService) {}

  createDoctorNotification(data: {
    title: string;
    doctorHandle: string;
    userId: string;
    redirectUrl: string;
    description?: string;
  }) {
    return this.prismaService.notification.create({
      data: {
        title: data.title,
        description: data.description ? data.description : '',
        redirectUrl: data.redirectUrl,
        user: {
          connect: {
            id: data.userId,
          },
        },
        doctor: {
          connect: {
            handle: data.doctorHandle,
          },
        },
      },
      include: {
        doctor: {
          select: {
            notificationChannel: true,
          },
        },
      },
    });
  }

  createPatientNotification(data: {
    title: string;
    patientHandle: string;
    userId: string;
    redirectUrl: string;
    description?: string;
  }) {
    return this.prismaService.notification.create({
      data: {
        title: data.title,
        description: data.description ? data.description : '',
        redirectUrl: data.redirectUrl,
        user: {
          connect: {
            id: data.userId,
          },
        },
        patient: {
          connect: {
            handle: data.patientHandle,
          },
        },
      },
      include: {
        patient: {
          select: {
            notificationChannel: true,
          },
        },
      },
    });
  }

  async getPatientNotificationsHandle(handle: string) {
    const notifications = await this.prismaService.patient.findUnique({
      where: {
        handle,
      },
      include: {
        notification: true,
      },
    });
    return notifications;
  }

  async getDoctorNotificationsUsingHandle(handle: string) {
    const notifications = await this.prismaService.doctor.findUnique({
      where: {
        handle,
      },
      include: {
        notification: true,
      },
    });
    return notifications;
  }
}
