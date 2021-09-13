import { Observable } from 'rxjs';

export interface ISchedulesService {
  createSchedule(request: CreateScheduleRequest): Observable<ISchedule>;
  listSchedule(): Observable<ListScheduleResponse>;
}

export interface ListScheduleResponse {
  data: ISchedule[];
}

export interface CreateScheduleRequest {
  title: string;
  description?: string;
  eventDate: string | Date;
}

export interface ISchedule {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
}
