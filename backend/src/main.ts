import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos basura que el usuario envíe y no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían propiedades no definidas
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
