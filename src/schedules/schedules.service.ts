import { Schedule } from '.prisma/client';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
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

    await this.scheduleQueue.add('create-schedule', schedule, {
      delay: schedule.eventDate.getTime() - now - this.MIN_10,
    });

    return schedule;
  }

  public async list(): Promise<Schedule[]> {
    return this.prismaProvider.schedule.findMany();
  }
}
