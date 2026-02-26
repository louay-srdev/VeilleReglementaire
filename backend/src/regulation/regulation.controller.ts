import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RegulationService } from './regulation.service';
import { CreateRegulationDto } from './dto/create-regulation.dto';
import { UpdateRegulationDto } from './dto/update-regulation.dto';
import { QueryRegulationDto } from './dto/query-regulation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('regulation')
@UseGuards(JwtAuthGuard)
export class RegulationController {
  constructor(private readonly regulationService: RegulationService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_CYRUS)
  create(@Body() dto: CreateRegulationDto) {
    return this.regulationService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryRegulationDto) {
    return this.regulationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regulationService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_CYRUS)
  update(@Param('id') id: string, @Body() dto: UpdateRegulationDto) {
    return this.regulationService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN_CYRUS)
  remove(@Param('id') id: string) {
    return this.regulationService.remove(id);
  }
}
