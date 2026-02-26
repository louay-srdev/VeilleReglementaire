import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActionPlanDto } from './dto/create-action-plan.dto';
import { UpdateActionPlanDto } from './dto/update-action-plan.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ActionPlanService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureClientAccess(complianceId: string, clientId: string | null, userRole: Role) {
    const compliance = await this.prisma.complianceMapping.findUnique({
      where: { id: complianceId },
      select: { clientId: true },
    });
    if (!compliance) return null;
    if (userRole === Role.CLIENT_USER && compliance.clientId !== clientId) {
      throw new ForbiddenException('Accès non autorisé à ce plan d\'action');
    }
    return compliance;
  }

  private async ensureActionAccess(actionPlanId: string, clientId: string | null, userRole: Role) {
    const action = await this.prisma.actionPlan.findUnique({
      where: { id: actionPlanId },
      include: { compliance: { select: { clientId: true } } },
    });
    if (!action) throw new NotFoundException('Plan d\'action non trouvé');
    if (userRole === Role.CLIENT_USER && action.compliance.clientId !== clientId) {
      throw new ForbiddenException('Accès non autorisé à ce plan d\'action');
    }
    return action;
  }

  async create(dto: CreateActionPlanDto, clientId: string | null, userRole: Role) {
    await this.ensureClientAccess(dto.complianceId, clientId, userRole);
    const targetDate = new Date(dto.targetDate);
    const completionDate = dto.completionDate ? new Date(dto.completionDate) : undefined;
    return this.prisma.actionPlan.create({
      data: {
        ...dto,
        targetDate,
        completionDate,
      },
      include: {
        compliance: { include: { regulation: true } },
        responsibleUser: { select: { id: true, email: true, fullName: true } },
      },
    });
  }

  async findByClient(clientId: string, userId: string, userRole: Role) {
    if (userRole === Role.CLIENT_USER) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { clientId: true },
      });
      if (user?.clientId !== clientId) {
        throw new ForbiddenException('Accès non autorisé');
      }
    }
    return this.prisma.actionPlan.findMany({
      where: { compliance: { clientId } },
      include: {
        compliance: { include: { regulation: true } },
        responsibleUser: { select: { id: true, email: true, fullName: true } },
      },
      orderBy: { targetDate: 'asc' },
    });
  }

  async findOne(id: string, clientId: string | null, userRole: Role) {
    const action = await this.ensureActionAccess(id, clientId, userRole);
    return this.prisma.actionPlan.findUnique({
      where: { id },
      include: {
        compliance: { include: { regulation: true, client: true } },
        responsibleUser: { select: { id: true, email: true, fullName: true } },
      },
    });
  }

  async update(id: string, dto: UpdateActionPlanDto, clientId: string | null, userRole: Role) {
    await this.ensureActionAccess(id, clientId, userRole);
    const targetDate = dto.targetDate ? new Date(dto.targetDate) : undefined;
    const completionDate = dto.completionDate ? new Date(dto.completionDate) : undefined;
    return this.prisma.actionPlan.update({
      where: { id },
      data: { ...dto, targetDate, completionDate },
      include: {
        compliance: { include: { regulation: true } },
        responsibleUser: { select: { id: true, email: true, fullName: true } },
      },
    });
  }

  async remove(id: string, clientId: string | null, userRole: Role) {
    await this.ensureActionAccess(id, clientId, userRole);
    return this.prisma.actionPlan.delete({ where: { id } });
  }
}
