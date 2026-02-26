import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { ActionStatus, ComplianceStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(clientId: string | undefined, userClientId: string | null, userRole: Role) {
    const effectiveClientId = clientId ?? userClientId;
    if (userRole === Role.CLIENT_USER && effectiveClientId !== userClientId) {
      throw new ForbiddenException('Accès non autorisé aux statistiques de ce client');
    }

    if (!effectiveClientId) {
      return this.getGlobalStats();
    }
    return this.getClientStats(effectiveClientId);
  }

  private async getGlobalStats() {
    const [complianceCounts, actionCounts, completedWithEfficiency] = await Promise.all([
      this.prisma.complianceMapping.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { isApplicable: true },
      }),
      this.prisma.actionPlan.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.actionPlan.findMany({
        where: { status: ActionStatus.REALISEE, efficiencyMeasure: { not: null } },
        select: { efficiencyMeasure: true },
      }),
    ]);

    const totalApplicable = complianceCounts.reduce((s, c) => s + c._count.id, 0);
    const conformes = complianceCounts.find((c) => c.status === ComplianceStatus.CONFORME)?._count.id ?? 0;
    const complianceRate = totalApplicable > 0 ? Math.round((conformes / totalApplicable) * 100) : 0;

    const actionsByStatus = actionCounts.reduce(
      (acc, c) => ({ ...acc, [c.status]: c._count.id }),
      {} as Record<ActionStatus, number>,
    );
    const totalCompleted = completedWithEfficiency.length;
    const withEfficiency = completedWithEfficiency.filter(
      (a) => a.efficiencyMeasure && a.efficiencyMeasure.trim() !== '',
    ).length;
    const efficiencyRate = totalCompleted > 0 ? Math.round((withEfficiency / totalCompleted) * 100) : 0;

    return {
      complianceRate,
      totalApplicable,
      conformes,
      actionsByStatus: {
        A_FAIRE: actionsByStatus.A_FAIRE ?? 0,
        EN_COURS: actionsByStatus.EN_COURS ?? 0,
        REALISEE: actionsByStatus.REALISEE ?? 0,
        EN_RETARD: actionsByStatus.EN_RETARD ?? 0,
      },
      efficiencyRate,
      totalCompletedActions: totalCompleted,
    };
  }

  private async getClientStats(clientId: string) {
    const [complianceCounts, actionCounts, completedWithEfficiency] = await Promise.all([
      this.prisma.complianceMapping.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { clientId, isApplicable: true },
      }),
      this.prisma.actionPlan.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { compliance: { clientId } },
      }),
      this.prisma.actionPlan.findMany({
        where: {
          compliance: { clientId },
          status: ActionStatus.REALISEE,
          efficiencyMeasure: { not: null },
        },
        select: { efficiencyMeasure: true },
      }),
    ]);

    const totalApplicable = complianceCounts.reduce((s, c) => s + c._count.id, 0);
    const conformes = complianceCounts.find((c) => c.status === ComplianceStatus.CONFORME)?._count.id ?? 0;
    const complianceRate = totalApplicable > 0 ? Math.round((conformes / totalApplicable) * 100) : 0;

    const actionsByStatus = actionCounts.reduce(
      (acc, c) => ({ ...acc, [c.status]: c._count.id }),
      {} as Record<ActionStatus, number>,
    );
    const totalCompleted = completedWithEfficiency.length;
    const withEfficiency = completedWithEfficiency.filter(
      (a) => a.efficiencyMeasure && a.efficiencyMeasure.trim() !== '',
    ).length;
    const efficiencyRate = totalCompleted > 0 ? Math.round((withEfficiency / totalCompleted) * 100) : 0;

    return {
      clientId,
      complianceRate,
      totalApplicable,
      conformes,
      actionsByStatus: {
        A_FAIRE: actionsByStatus.A_FAIRE ?? 0,
        EN_COURS: actionsByStatus.EN_COURS ?? 0,
        REALISEE: actionsByStatus.REALISEE ?? 0,
        EN_RETARD: actionsByStatus.EN_RETARD ?? 0,
      },
      efficiencyRate,
      totalCompletedActions: totalCompleted,
    };
  }
}
