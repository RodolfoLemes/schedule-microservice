import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SchedulesModule } from './schedules/schedules.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: process.env.REDIS_URL,
    }),
    SchedulesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
