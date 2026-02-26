import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ComplianceStatus } from '@prisma/client';

export class UpdateComplianceDto {
  @IsOptional()
  @IsEnum(ComplianceStatus)
  status?: ComplianceStatus;

  @IsOptional()
  @IsBoolean()
  isApplicable?: boolean;
}
