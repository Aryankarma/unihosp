import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './socketServices/socket.adapter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const port = process.env.PORT || 3000;

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://127.0.0.1:4200',
      'http://127.0.0.1:3020',
      'http://localhost:3020',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'https://unihosp.live',
      'http://unihosp.live',
    ],
    credentials: true,
  });

  const globalPrefix = 'api/v1/';

  app.setGlobalPrefix(globalPrefix);
  app.useWebSocketAdapter(new SocketIOAdapter(app));
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}
bootstrap().catch(() => {
  process.exit(1);
});
