import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CitizenStatusService {
  constructor(private readonly prisma: PrismaService) {}

  async summarize(citizenId: string) {
    const items = await this.prisma.citizenStatusEvent.findMany({
      where: { citizenId, isActive: true },
      orderBy: { startsAt: 'desc' },
    });
    return {
      overall: items.some((item) => (item.impactPolicy as { blockAll?: boolean }).blockAll) ? 'RESTRICTED' : 'STABLE',
      items,
    };
  }
}
