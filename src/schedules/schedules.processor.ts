import { Schedule } from '.prisma/client';
import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from 'bull';
import { enNotificationPatterns } from 'src/messages/notification.enum';

@Processor('schedule')
export class SchedulesProcessor {
  constructor(@Inject('NOTIFICATIONS_SERVICE') private client: ClientProxy) {}

  @Process('create-schedule')
  handleSchedule(job: Job<Schedule>) {
    console.info(job.id);
    return this.client.emit(
      enNotificationPatterns.createNotification,
      job.data,
    );
  }
}
