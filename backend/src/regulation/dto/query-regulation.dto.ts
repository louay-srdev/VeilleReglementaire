import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { RegType, RiskLevel, Domain } from '@prisma/client';

export class QueryRegulationDto {
  @IsOptional()
  @IsEnum(RegType)
  type?: RegType;

  @IsOptional()
  @IsString()
  ministry?: string;

  @IsOptional()
  @IsString()
  authority?: string;

  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @IsOptional()
  @IsEnum(Domain)
  domain?: Domain;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
