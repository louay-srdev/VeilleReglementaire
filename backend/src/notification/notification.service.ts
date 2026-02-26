import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ActionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *', { name: 'action-reminder-d2' })
  async handleActionRemindersD2() {
    const inTwoDays = new Date();
    inTwoDays.setDate(inTwoDays.getDate() + 2);
    inTwoDays.setHours(0, 0, 0, 0);
    const endOfDay = new Date(inTwoDays);
    endOfDay.setHours(23, 59, 59, 999);

    const actions = await this.prisma.actionPlan.findMany({
      where: {
        targetDate: { gte: inTwoDays, lte: endOfDay },
        status: { in: [ActionStatus.A_FAIRE, ActionStatus.EN_COURS] },
      },
      include: {
        compliance: {
          include: {
            client: { select: { companyName: true } },
            regulation: { select: { title: true, reference: true } },
          },
        },
        responsibleUser: { select: { id: true, email: true, fullName: true } },
      },
    });

    for (const action of actions) {
      this.logger.log(
        `[Rappel J-2] Action "${action.description}" (${action.id}) - ` +
          `Client: ${action.compliance.client.companyName}, ` +
          `Réglementation: ${action.compliance.regulation.title}, ` +
          `Responsable: ${action.responsibleUser?.email ?? 'non assigné'}, ` +
          `Échéance: ${action.targetDate.toISOString().split('T')[0]}`,
      );
    }

    if (actions.length > 0) {
      this.logger.log(`Rappels J-2: ${actions.length} action(s) à échéance dans 2 jours.`);
    }
  }
}
