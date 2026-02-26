import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ActionStatus } from '@prisma/client';

export class UpdateActionPlanDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  responsibleUserId?: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @IsOptional()
  @IsEnum(ActionStatus)
  status?: ActionStatus;

  @IsOptional()
  @IsString()
  efficiencyMeasure?: string;
}
