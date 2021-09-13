import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateScheduleDTO {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => Date)
  public eventDate: Date;
}
