import { Injectable } from '@nestjs/common';
import { AssetDomainService } from '../common/engines/asset-domain.service';
import { OwnershipDomainService } from '../common/engines/ownership-domain.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { TransferOwnershipDto } from './dto/transfer-ownership.dto';

@Injectable()
export class AssetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly assetDomain: AssetDomainService,
    private readonly ownershipDomain: OwnershipDomainService,
  ) {}

  list(citizenId?: string) {
    if (citizenId) {
      return this.prisma.ownershipRecord.findMany({
        where: { citizenId, isCurrent: true },
        include: { asset: true },
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.prisma.asset.findMany({ orderBy: { createdAt: 'desc' } });
  }

  get(id: string) {
    return this.prisma.asset.findUniqueOrThrow({
      where: { id },
      include: { ownerships: true, records: true },
    });
  }

  createPending(input: { assetNumber: string; assetType: string; issuingEntityId: string; descriptiveData: Record<string, unknown>; createdViaRequestId?: string }) {
    return this.assetDomain.createPendingAsset(input);
  }

  transferOwnership(id: string, dto: TransferOwnershipDto) {
    return this.ownershipDomain.transferOwnership(id, dto.fromCitizenId, dto.toCitizenId, dto.legalBasisRecordId);
  }
}
