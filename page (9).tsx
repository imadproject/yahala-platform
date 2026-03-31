import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CitizenStatusService } from './citizen-status.service';

@Injectable()
export class Citizen360AggregatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly citizenStatusService: CitizenStatusService,
  ) {}

  async getCitizen360(citizenId: string) {
    const [profile, requests, ownerships, parties, notifications, appointments, records, statusSummary] = await Promise.all([
      this.prisma.citizenProfile.findUniqueOrThrow({ where: { id: citizenId } }),
      this.prisma.serviceRequest.findMany({ where: { citizenId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.prisma.ownershipRecord.findMany({ where: { citizenId }, include: { asset: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.legalParty.findMany({ where: { citizenId }, include: { legalCase: true } }),
      this.prisma.notification.findMany({ where: { recipient: { citizenProfile: { id: citizenId } } }, take: 20, orderBy: { createdAt: 'desc' } }),
      this.prisma.appointment.findMany({ where: { citizenId }, orderBy: { startsAt: 'desc' }, take: 20 }),
      this.prisma.record.findMany({ where: { subjectId: citizenId }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.citizenStatusService.summarize(citizenId),
    ]);

    return { profile, statusSummary, requests, ownerships, legalCases: parties.map((p) => p.legalCase), notifications, appointments, records };
  }
}
