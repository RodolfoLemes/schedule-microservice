import { Controller } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateScheduleRequest } from './schedules.interface';

@Controller()
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @GrpcMethod('SchedulesService')
  createSchedule(data: CreateScheduleRequest) {
    return this.schedulesService.create({
      ...data,
      eventDate: new Date(data.eventDate),
    });
  }

  @GrpcMethod('SchedulesService')
  listSchedules() {
    return this.schedulesService.list();
  }
}
