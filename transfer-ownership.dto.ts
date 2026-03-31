import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ServicesCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.serviceDefinition.findMany({ include: { ownerEntity: true }, orderBy: { createdAt: 'desc' } });
  }

  get(id: string) {
    return this.prisma.serviceDefinition.findUniqueOrThrow({ where: { id }, include: { ownerEntity: true } });
  }
}
