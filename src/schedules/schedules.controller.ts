import { Controller } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateScheduleRequest } from './schedules.interface';
import { Schedule } from '.prisma/client';

@Controller()
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @GrpcMethod('SchedulesService')
  createSchedule(data: CreateScheduleRequest) {
    return this.schedulesService.create({
      ...data,
      eventDate: new Date(data.eventDate), // this treatment is because protobuf doesn't handle with Date types correctly
    });
  }

  @GrpcMethod('SchedulesService')
  updateSchedule(data: Schedule) {
    const { id, ...model } = data;

    return this.schedulesService.update(id, {
      ...model,
      eventDate: new Date(model.eventDate), // this treatment is because protobuf doesn't handle with Date types correctly
    });
  }

  @GrpcMethod('SchedulesService')
  deleteSchedule(data: Schedule) {
    const { id } = data;

    return this.schedulesService.remove(id);
  }

  @GrpcMethod('SchedulesService')
  listSchedules() {
    return this.schedulesService.list();
  }
}
