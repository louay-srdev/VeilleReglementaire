import { IsOptional, IsString } from 'class-validator';

export class DashboardQueryDto {
  @IsOptional()
  @IsString()
  clientId?: string;
}
