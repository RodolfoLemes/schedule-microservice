import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesProcessor } from './schedules.processor';
import { SchedulesController } from './schedules.controller';
import { BullModule } from '@nestjs/bull';
import { PrismaProvider } from '../providers/prisma.provider';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'schedule',
    }),
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'notifications_queue',
          noAck: false,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesProcessor, PrismaProvider],
})
export class SchedulesModule {}
