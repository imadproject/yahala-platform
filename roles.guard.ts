import { Injectable } from '@nestjs/common';
import { LegalCaseDomainService } from '../common/engines/legal-case-domain.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService, private readonly legalCaseDomain: LegalCaseDomainService) {}

  list(citizenId?: string) {
    if (citizenId) {
      return this.prisma.legalParty.findMany({ where: { citizenId }, include: { legalCase: true }, orderBy: { legalCase: { createdAt: 'desc' } } });
    }
    return this.prisma.legalCase.findMany({ orderBy: { createdAt: 'desc' } });
  }

  get(id: string) {
    return this.prisma.legalCase.findUniqueOrThrow({ where: { id }, include: { sessions: true, parties: true, records: true } });
  }

  create(dto: CreateCaseDto) {
    return this.legalCaseDomain.createCase(dto);
  }
}
