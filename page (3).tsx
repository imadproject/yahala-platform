import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DependenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async evaluateServiceEligibility(citizenId: string, serviceId: string) {
    const service = await this.prisma.serviceDefinition.findUniqueOrThrow({ where: { id: serviceId } });
    const activeStatuses = await this.prisma.citizenStatusEvent.findMany({
      where: { citizenId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    const blockingStatus = activeStatuses.find((status) => {
      const policy = status.impactPolicy as Record<string, unknown>;
      const blockedServices = (policy?.blockedServiceCodes as string[] | undefined) ?? [];
      return blockedServices.includes(service.serviceCode) || policy?.blockAll === true;
    });

    return {
      allowed: !blockingStatus,
      blockingReason: blockingStatus?.title ?? null,
      service,
      activeStatuses,
    };
  }
}
