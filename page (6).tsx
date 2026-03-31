import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OwnershipDomainService {
  constructor(private readonly prisma: PrismaService) {}

  async transferOwnership(assetId: string, fromCitizenId: string, toCitizenId: string, legalBasisRecordId?: string) {
    const current = await this.prisma.ownershipRecord.findFirst({ where: { assetId, citizenId: fromCitizenId, isCurrent: true } });
    if (!current) throw new BadRequestException('Current ownership record not found for source citizen');

    await this.prisma.ownershipRecord.update({
      where: { id: current.id },
      data: { isCurrent: false, effectiveTo: new Date() },
    });

    const next = await this.prisma.ownershipRecord.create({
      data: {
        assetId,
        citizenId: toCitizenId,
        ownershipType: current.ownershipType,
        shareNumerator: current.shareNumerator,
        shareDenominator: current.shareDenominator,
        legalBasisRecordId,
        effectiveFrom: new Date(),
        isCurrent: true,
      },
    });

    await this.prisma.asset.update({
      where: { id: assetId },
      data: { currentOwnerRecordId: next.id, assetState: 'OWNERSHIP_TRANSFERRED' },
    });

    return next;
  }
}
