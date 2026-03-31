import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetDomainService {
  constructor(private readonly prisma: PrismaService) {}

  async createPendingAsset(input: {
    assetNumber: string;
    assetType: string;
    issuingEntityId: string;
    descriptiveData: Record<string, unknown>;
    createdViaRequestId?: string;
  }) {
    return this.prisma.asset.create({
      data: {
        assetNumber: input.assetNumber,
        assetType: input.assetType,
        issuingEntityId: input.issuingEntityId,
        descriptiveData: input.descriptiveData,
        legalStatus: 'CLEAR',
        registrationState: 'PENDING_APPROVAL',
        assetState: 'PENDING_APPROVAL',
        createdViaRequestId: input.createdViaRequestId,
      },
    });
  }
}
