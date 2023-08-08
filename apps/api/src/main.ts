import { NestFactory } from '@nestjs/core';
import express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(express.json());

  await app.listen(3000);
}
bootstrap();
