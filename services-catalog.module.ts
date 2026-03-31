import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class CitizensService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.citizenProfile.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.citizenProfile.findUniqueOrThrow({ where: { id } });
  }
}
