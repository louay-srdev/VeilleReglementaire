import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ActionPlanService } from './action-plan.service';
import { CreateActionPlanDto } from './dto/create-action-plan.dto';
import { UpdateActionPlanDto } from './dto/update-action-plan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('action-plan')
@UseGuards(JwtAuthGuard)
export class ActionPlanController {
  constructor(private readonly actionPlanService: ActionPlanService) {}

  @Post()
  create(
    @Body() dto: CreateActionPlanDto,
    @CurrentUser('clientId') clientId: string | null,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.actionPlanService.create(dto, clientId, userRole);
  }

  @Get('client/:clientId')
  findByClient(
    @Param('clientId') clientId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.actionPlanService.findByClient(clientId, userId, userRole);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('clientId') clientId: string | null,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.actionPlanService.findOne(id, clientId, userRole);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateActionPlanDto,
    @CurrentUser('clientId') clientId: string | null,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.actionPlanService.update(id, dto, clientId, userRole);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('clientId') clientId: string | null,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.actionPlanService.remove(id, clientId, userRole);
  }
}
