import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ComplianceStatus } from '@prisma/client';

export class CreateComplianceDto {
  @IsString()
  clientId: string;

  @IsString()
  regulationId: string;

  @IsOptional()
  @IsEnum(ComplianceStatus)
  status?: ComplianceStatus;

  @IsOptional()
  @IsBoolean()
  isApplicable?: boolean;
}
