import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar validación global usando los DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina automáticamente las propiedades que no están en el DTO
    forbidNonWhitelisted: true, // Lanza un error si hay propiedades no definidas en el DTO
    transform: true, // Transforma los tipos de datos automáticamente según los DTOs
  }));

  await app.listen(3000);
}
bootstrap();

