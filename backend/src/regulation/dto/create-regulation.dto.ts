import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { RegType, RiskLevel, Domain } from '@prisma/client';

export class CreateRegulationDto {
  @IsString()
  title: string;

  @IsEnum(RegType)
  type: RegType;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  ministry?: string;

  @IsOptional()
  @IsString()
  authority?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @IsOptional()
  @IsEnum(Domain)
  domain?: Domain;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}
