import { Socket } from "socket.io";

export type AuthPayload = {
  userId: string,
  name: string
}

export type SocketWithAuth = Socket & AuthPayload;