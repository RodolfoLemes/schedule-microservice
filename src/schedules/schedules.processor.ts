import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('schedule')
export class SchedulesProcessor {
  @Process('create-schedule')
  handleSchedule(job: Job) {
    console.log(job.id + 'estou executando em!');
  }
}
