import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegalCaseDomainService {
  constructor(private readonly prisma: PrismaService) {}

  async createCase(input: {
    caseNumber: string;
    caseType: string;
    courtEntityId: string;
    primaryCitizenId?: string;
    partiesSnapshot: Record<string, unknown>;
    linkedAssetIds?: string[];
  }) {
    return this.prisma.legalCase.create({
      data: {
        caseNumber: input.caseNumber,
        caseType: input.caseType,
        courtEntityId: input.courtEntityId,
        primaryCitizenId: input.primaryCitizenId,
        partiesSnapshot: input.partiesSnapshot,
        serviceOfProcessState: 'PENDING_SERVICE',
        judgmentState: 'NOT_ISSUED',
        executionState: 'NOT_REQUIRED',
        linkedAssetIds: input.linkedAssetIds ?? [],
        legalEffectsProfile: {},
      },
    });
  }
}
