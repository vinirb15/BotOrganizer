import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate } from 'class-validator';

export class EventDTO {
  @IsOptional()
  @IsNumber()
  @Transform((params) => Number(params.value))
  eventId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform((params) => Number(params.value))
  userId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsDate()
  @Transform((params) => new Date(params.value))
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform((params) => new Date(params.value))
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  repeat: string;

  @IsOptional()
  @IsString()
  guests: string;

  @IsOptional()
  @IsString()
  notes: string;
}
