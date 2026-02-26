import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(
    @Query() query: DashboardQueryDto,
    @CurrentUser('clientId') userClientId: string | null,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.dashboardService.getStats(query.clientId, userClientId, userRole);
  }
}
