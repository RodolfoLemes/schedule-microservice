import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules/schedules.controller';
import { PrismaProvider } from './providers/prisma.provider';
import { SchedulesService } from './schedules/schedules.service';
import { BullModule } from '@nestjs/bull';
import { SchedulesProcessor } from './schedules/schedules.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'schedule',
    }),
  ],
  controllers: [SchedulesController],
  providers: [PrismaProvider, SchedulesService, SchedulesProcessor],
})
export class AppModule {}
