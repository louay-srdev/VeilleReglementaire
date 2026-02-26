import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ActionStatus } from '@prisma/client';

export class CreateActionPlanDto {
  @IsString()
  complianceId: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  responsibleUserId?: string;

  @IsDateString()
  targetDate: string;

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
