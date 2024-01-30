import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'connect-chat',
})
export class ChattingGateway implements OnGatewayInit, OnGatewayConnection {
  private logger = new Logger(ChattingGateway.name);

  @WebSocketServer() chatNamespace: Namespace;

  afterInit() {
    this.logger.debug(`${ChattingGateway.name} Initialized`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(socket: Socket, ...args: unknown[]) {
    const chatRoomID: string = socket.client.request.headers[
      'chat-room-id'
    ] as string;
    if (chatRoomID && chatRoomID !== '') {
      socket.join(chatRoomID);
      socket.to(chatRoomID).emit('greetings', 'Hi! Guys');
    }
  }

  // handleDisconnect(client: So) {
  // }

  // @SubscribeMessage("greetings")
  // joinChatRoom(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
  //   const id = client.handshake.headers['chat-room-id'];
  //   console.log(client.rooms, id);
  //   client.to(id).emit('greetings', message);
  // }

  @SubscribeMessage('exit-chat-room')
  exitChatRoom() {}
}
