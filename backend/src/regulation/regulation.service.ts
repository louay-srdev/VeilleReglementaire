import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegulationDto } from './dto/create-regulation.dto';
import { UpdateRegulationDto } from './dto/update-regulation.dto';
import { QueryRegulationDto } from './dto/query-regulation.dto';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class RegulationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRegulationDto) {
    const publicationDate = dto.publicationDate
      ? new Date(dto.publicationDate)
      : undefined;
    return this.prisma.regulation.create({
      data: {
        ...dto,
        publicationDate,
      },
    });
  }

  async findAll(query: QueryRegulationDto) {
    const {
      page = 1,
      limit = 20,
      type,
      ministry,
      authority,
      riskLevel,
      domain,
      search,
    } = query;
    const where: Prisma.RegulationWhereInput = {};
    if (type) where.type = type;
    if (ministry) where.ministry = ministry;
    if (authority) where.authority = authority;
    if (riskLevel) where.riskLevel = riskLevel;
    if (domain) where.domain = domain;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { reference: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [items, total] = await Promise.all([
      this.prisma.regulation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { title: 'asc' },
      }),
      this.prisma.regulation.count({ where }),
    ]);
    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const regulation = await this.prisma.regulation.findUnique({
      where: { id },
    });
    if (!regulation) {
      throw new NotFoundException('Réglementation non trouvée');
    }
    return regulation;
  }

  async update(id: string, dto: UpdateRegulationDto) {
    await this.findOne(id);
    const publicationDate = dto.publicationDate
      ? new Date(dto.publicationDate)
      : undefined;
    return this.prisma.regulation.update({
      where: { id },
      data: { ...dto, publicationDate },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.regulation.delete({ where: { id } });
  }
}
