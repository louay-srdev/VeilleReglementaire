import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { CreateComplianceDto } from './dto/create-compliance.dto';
import { UpdateComplianceDto } from './dto/update-compliance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('compliance')
@UseGuards(JwtAuthGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_CYRUS)
  create(@Body() dto: CreateComplianceDto) {
    return this.complianceService.create(dto);
  }

  @Get('client/:clientId')
  findByClient(
    @Param('clientId') clientId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.complianceService.findByClient(clientId, userId, userRole);
  }

  @Get('client/:clientId/applicable')
  findApplicableByClient(
    @Param('clientId') clientId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.complianceService.findApplicableByClient(clientId, userId, userRole);
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateComplianceDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.complianceService.updateStatus(id, dto, userId, userRole);
  }
}
