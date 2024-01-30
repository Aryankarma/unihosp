import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Namespace, Socket } from 'socket.io';
import { NotifierService } from './service/notifier.service';
import { LogToDbService } from '../../log-to-db/log-to-db.service';

@WebSocketGateway({
  namespace: 'notification',
})
export class NotifierGateway implements OnGatewayInit, OnGatewayConnection {
  private readonly logger = new Logger(NotifierGateway.name);

  constructor(
    private readonly configService: ConfigService,
    private noitificationService: NotifierService,
    private loggerService: LogToDbService
  ) {}

  async handleConnection(client: Socket) {
    const notificationChannel: string = client.client.request.headers[
      'notification-channel'
    ] as string;

    client.join(notificationChannel);
    console.log(client.rooms);
    client.to(notificationChannel).emit('notice', 'Hi');
    this.loggerService.log(`User Connected on Notification Channel`);
  }

  // handleDisconnect(client: Socket) {

  // }

  @SubscribeMessage('previous-notification')
  async previousNotifications(client: Socket) {
    const doctorHandle: string = client.client.request.headers[
      'doctor-handle'
    ] as string;
    const patientHandle: string = client.handshake.headers[
      'patient-handle'
    ] as string;
    if (doctorHandle) {
      const doctor =
        await this.noitificationService.getDoctorNotificationsUsingHandle(
          doctorHandle
        );
      if (doctor) {
        console.log(doctor);
        client.join(doctor.notificationChannel);
        client.join(doctorHandle);
        console.log(client.rooms);
        client
          .to(doctorHandle)
          .emit('previous-notification', doctor.notification);
      }
    } else if (patientHandle) {
      const patient =
        await this.noitificationService.getDoctorNotificationsUsingHandle(
          patientHandle
        );
      if (patient) {
        client.join(patient.notificationChannel);
        client
          .to(patient.notificationChannel)
          .emit('previous-notification', patient.notification);
      }
    }
  }

  @SubscribeMessage('request-profile')
  async profileAccessNotification() {}

  @SubscribeMessage('notify')
  async notify(client: Socket, data: string) {
    const userId: string = client.client.request.headers['user-id'] as string;
    const doctorHandle: string = client.client.request.headers[
      'doctor-handle'
    ] as string;
    const patientHandle: string = client.client.request.headers[
      'patient-handle'
    ] as string;
    const message: { redirectUrl: string; title: string } = JSON.parse(data);
    if (doctorHandle) {
      const notification =
        await this.noitificationService.createDoctorNotification({
          doctorHandle: doctorHandle,
          redirectUrl: message.redirectUrl,
          title: message.title,
          userId,
        });
      if (!notification) return { error: 'Notification Not Created' };
      if (!notification.doctor) return { error: 'Doctor Not Found' };
      client.join(notification.doctor.notificationChannel);
      client
        .to(notification.doctor.notificationChannel)
        .emit('notice', message);
      client.leave(notification.doctor.notificationChannel);
    } else if (patientHandle) {
      const notification =
        await this.noitificationService.createPatientNotification({
          patientHandle,
          redirectUrl: message.redirectUrl,
          title: message.title,
          userId,
        });
      if (!notification) return { error: 'Notification Not Created' };
      if (!notification.patient) return { error: 'Patient Not Found' };
      client.join(notification.patient.notificationChannel);
      client
        .to(notification.patient.notificationChannel)
        .emit('notice', message);
      client.leave(notification.patient.notificationChannel);
    }
  }

  @WebSocketServer() notifier: Namespace;

  afterInit(): void {
    this.logger.debug(`${NotifierGateway.name} Initialized`);
  }

  // @SubscribeMessage('message')
  // handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
  //   this.logger.debug(`Received Message: ${data}`);
  //   client.broadcast.emit('message', data);
  // }

  // private count = 0;

  // @SubscribeMessage("notify")
  // async handleRoomJoining(client: Socket, data: string, room: string) {
  //   const userId = client.handshake.headers['userId'];
  //   const doctorId = client.handshake.headers['doctorId'];
  //   const patientId = client.handshake.headers['patientId'];
  //   let notificationGenerated: Notification;

  //   // if (doctorId) {
  //   //   notificationGenerated = await this.noitificationService.createDoctorNotification({

  //   //   });
  //   // } else if (patientId) {
  //   //   notificationGenerated = await this.noitificationService.createDoctorNotification({

  //   //   });
  //   // }
  //   console.log(client.rooms)
  //   client.join(data);
  //   client.to(data).emit("message", `Greetings, I am ${client.id}`);
  // }

  // async handleConnection(client: Socket) {
  //   const userId = client.handshake.headers['userId'];
  //   const doctorHandle = client.handshake.headers['doctor-handle'] as string;
  //   const patientHandle = client.handshake.headers['patient-handle'] as string;

  //   this.logger.debug(`WS client with id: ${client.id} connected!`);
  //   this.logger.debug(`Number of connected sockets: ${this.notifier.sockets.size}`);

  //   if (doctorHandle) {
  //     const doctor = await this.noitificationService.getDoctorNotificationsUsingHandle(doctorHandle);
  //     if (doctor) {
  //       console.log(doctor);
  //       // client.join(doctor.notificationChannel);
  //       client.join(doctorHandle);
  //       console.log(client.rooms);

  //       // client.to(doctor.notificationChannel).emit('previous-notification', "Hi");
  //       // client.to(doctor.notificationChannel).emit('previous-notification', doctor.notification);
  //       client.to(doctorHandle).emit('previous-notification', "Namaste")
  //     }
  //   } else if (patientHandle) {
  //     const patient = await this.noitificationService.getDoctorNotificationsUsingHandle(patientHandle);
  //     if (patient) {
  //       client.join(patient.notificationChannel);
  //       client.to(patient.notificationChannel).emit('previous-notification', patient.notification);
  //     }
  //   }

  //   this.count++;

  //   this.logger.debug(`Notifier Name: ${this.notifier.name}`);
  // }

  // @SubscribeMessage('previous-notification')
  // async previousNotification(client: Socket, message: string) {
  //   const doctorHandle = client.handshake.headers['doctor-handle'] as string;
  //   // const doctor = await this.noitificationService.getDoctorNotificationsUsingHandle(doctorHandle);
  //   // if (doctor) {
  //   //   console.log(doctor);
  //   //   client.join(doctor.notificationChannel);
  //   //   console.log(client.rooms);

  //   //   client.to(doctor.notificationChannel).emit('previous-notification', "Hi");
  //   //   client.to(doctor.notificationChannel).emit('previous-notification', doctor.notification);
  //   // }
  //   client.to(doctorHandle).emit('previous-notification', "Hi");
  // }

  // async handleDisconnect(client: Socket) {
  //   const sockets = this.notifier.sockets;
  //   this.count--;
  //   try {
  //     await this.loggerService.log(`WS client with id: ${client.id} connected!`);
  //   } catch (err) {
  //     await this.loggerService.log(JSON.stringify(err)).catch(this.logger.log);
  //     this.logger.log(JSON.stringify(err));
  //   }
  //   this.logger.debug(`WS client with id: ${client.id} disconnected!`);
  //   this.logger.debug(`Number of connected sockets: ${sockets.size}`);
  // }
}
