import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class EntitiesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.governmentEntity.findMany({ orderBy: { createdAt: 'desc' } });
  }

  get(id: string) {
    return this.prisma.governmentEntity.findUniqueOrThrow({
      where: { id },
      include: { services: true, childEntities: true },
    });
  }
}
