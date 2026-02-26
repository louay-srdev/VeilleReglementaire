import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateComplianceDto } from './dto/create-compliance.dto';
import { UpdateComplianceDto } from './dto/update-compliance.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateComplianceDto) {
    const existing = await this.prisma.complianceMapping.findUnique({
      where: {
        clientId_regulationId: { clientId: dto.clientId, regulationId: dto.regulationId },
      },
    });
    if (existing) {
      throw new ConflictException('Ce client est déjà associé à cette réglementation');
    }
    return this.prisma.complianceMapping.create({
      data: dto,
      include: { regulation: true, client: { select: { companyName: true } } },
    });
  }

  async findByClient(clientId: string, userId: string, userRole: Role) {
    if (userRole === Role.CLIENT_USER && userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { clientId: true },
      });
      if (user?.clientId !== clientId) {
        throw new ForbiddenException('Accès non autorisé à ce client');
      }
    }
    return this.prisma.complianceMapping.findMany({
      where: { clientId },
      include: {
        regulation: true,
        _count: { select: { actionPlans: true } },
      },
    });
  }

  async findApplicableByClient(clientId: string, userId: string, userRole: Role) {
    if (userRole === Role.CLIENT_USER) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { clientId: true },
      });
      if (user?.clientId !== clientId) {
        throw new ForbiddenException('Accès non autorisé à ce client');
      }
    }
    return this.prisma.complianceMapping.findMany({
      where: { clientId, isApplicable: true },
      include: { regulation: true },
    });
  }

  async updateStatus(
    complianceId: string,
    dto: UpdateComplianceDto,
    userId: string,
    userRole: Role,
  ) {
    const compliance = await this.prisma.complianceMapping.findUnique({
      where: { id: complianceId },
      select: { clientId: true },
    });
    if (!compliance) {
      throw new NotFoundException('Conformité non trouvée');
    }
    if (userRole === Role.CLIENT_USER) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { clientId: true },
      });
      if (user?.clientId !== compliance.clientId) {
        throw new ForbiddenException('Vous ne pouvez modifier que les conformités de votre client');
      }
    }
    return this.prisma.complianceMapping.update({
      where: { id: complianceId },
      data: dto,
      include: { regulation: true },
    });
  }
}
