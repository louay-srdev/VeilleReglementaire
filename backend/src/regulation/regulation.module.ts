import { Module } from '@nestjs/common';
import { RegulationService } from './regulation.service';
import { RegulationController } from './regulation.controller';

@Module({
  controllers: [RegulationController],
  providers: [RegulationService],
  exports: [RegulationService],
})
export class RegulationModule {}
