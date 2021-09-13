import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'schedules',
        protoPath: path.join(__dirname, 'schedules/schedule.proto'),
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  app.listen();
}
bootstrap();
