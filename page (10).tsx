import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IntegrationSyncService {
  constructor(private readonly prisma: PrismaService) {}

  async listFeeds() {
    return this.prisma.integrationFeed.findMany({ include: { sourceEntity: true }, orderBy: { createdAt: 'desc' } });
  }
}
