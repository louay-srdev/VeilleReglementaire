import { Module } from '@nestjs/common';
import { ActionPlanService } from './action-plan.service';
import { ActionPlanController } from './action-plan.controller';

@Module({
  controllers: [ActionPlanController],
  providers: [ActionPlanService],
  exports: [ActionPlanService],
})
export class ActionPlanModule {}
