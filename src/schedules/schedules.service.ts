import { Schedule } from '.prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Queue } from 'bull';
import { PrismaProvider } from '../providers/prisma.provider';
import { CreateScheduleRequest } from './schedules.interface';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectQueue('schedule') private readonly scheduleQueue: Queue,
    private readonly prismaProvider: PrismaProvider,
  ) {}

  private MIN_10 = 1000 * 60 * 10; // 10 min

  public async create(data: CreateScheduleRequest): Promise<Schedule> {
    const now = Date.now();

    const schedule = await this.prismaProvider.schedule.create({
      data,
    });

    this.scheduleQueue.add('create-schedule', schedule, {
      delay: schedule.eventDate.getTime() - now - this.MIN_10,
      jobId: schedule.id,
    });

    return schedule;
  }

  public async update(
    scheduleId: string,
    data: CreateScheduleRequest,
  ): Promise<Schedule> {
    const now = Date.now();

    const schedule = await this.prismaProvider.schedule.findFirst({
      where: {
        id: scheduleId,
      },
    });

    if (!schedule) throw new RpcException('schedule-not-found');

    const updatedSchedule = await this.prismaProvider.schedule.update({
      where: {
        id: schedule.id,
      },
      data,
    });

    if (schedule.eventDate !== data.eventDate) {
      const job = await this.scheduleQueue.getJob(schedule.id);
      await job.remove();

      this.scheduleQueue.add('create-schedule', updatedSchedule, {
        delay: updatedSchedule.eventDate.getTime() - now - this.MIN_10,
        jobId: updatedSchedule.id,
      });
    }

    return updatedSchedule;
  }

  public async remove(scheduleId: string): Promise<void> {
    const schedule = await this.prismaProvider.schedule.findFirst({
      where: {
        id: scheduleId,
      },
    });

    if (!schedule) throw new RpcException('schedule-not-found');

    await this.prismaProvider.schedule.delete({
      where: {
        id: schedule.id,
      },
    });

    const job = await this.scheduleQueue.getJob(schedule.id);
    await job.remove();
  }

  public async list(): Promise<Schedule[]> {
    return this.prismaProvider.schedule.findMany();
  }
}
