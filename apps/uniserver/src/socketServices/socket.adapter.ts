/* eslint-disable @typescript-eslint/no-explicit-any */
import { INestApplication, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { Server, ServerOptions, Socket } from "socket.io";
import { AppAuthentication } from "../app.auth.service";
import { SocketWithAuth } from "../interfaces/socketWithAuth";


export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);

  jwtService: JwtService;
  appAuthService: AppAuthentication;

  constructor(private app: INestApplication) {
    super(app);
    this.jwtService = app.get(JwtService);
    this.appAuthService = app.get(AppAuthentication);
    this.authentication = this.authentication.bind(this);
    this.appAuthentication = this.appAuthentication.bind(this)
  }

  authentication = (socket: SocketWithAuth, next: any) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['token'];
    this.logger.debug(token);

    try {
      const payload = this.jwtService.verify(token);
      // this.logger.debug(payload);

      socket.userId = payload.id;
      socket.name = payload.name;

      next();
    } catch (err) {
      this.logger.error(err);
      next(new Error("FORBIDDEN"));
    }
  }

  appAuthentication(socket: Socket, next: any) {
    const appID = socket.handshake.headers["app-id"] as string;
    if (this.appAuthService.verifyAppWithID(appID)) {
      return next();
    }
    next(new Error("FORBIDDEN, Wrong app Not allowed"));
  }

  createIOServer(port: number, options: ServerOptions) {
    this.logger.debug('Configuring SocketIO Server');

    options = {
      ...options,
      cors: {
        origin: [
          `http://localhost:3000`,
          `http://127.0.0.1:3000`,
          `http://localhost:4200`,
          `http://127.0.0.1:4200`,
          `http://localhost:3020`,
          `http://127.0.0.1:3020`,
          `http://localhost:5500`,
          `http://127.0.0.1:5500`,
          'http://192.168.56.249:4200/',
          'https://unihosp.live'
        ],
        credentials: true
      },
    };
    const io: Server = super.createIOServer(port, options);
    io.of(/\w*/).use(this.appAuthentication);
    // io.of(/\w*/).use(this.authentication);

    return io;
  }
}
