/* eslint-disable @typescript-eslint/no-floating-promises */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { ValidationPipe } from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.use(cookieParser());

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes unknown properties
      forbidNonWhitelisted: true, // throws error if extra properties are sent
      transform: true, // transforms payload to DTO class instances
    }),
  );

  const port = configService.get<string>('PORT');

  await app.listen(port as string);
}

bootstrap();
