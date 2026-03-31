import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: {
    actorUserId?: string;
    actionCode: string;
    objectType: string;
    objectId: string;
    objectSnapshot?: unknown;
    metadata?: unknown;
    ipAddress?: string;
  }) {
    return this.prisma.auditEvent.create({
      data: {
        actorUserId: input.actorUserId,
        actionCode: input.actionCode,
        objectType: input.objectType,
        objectId: input.objectId,
        objectSnapshot: (input.objectSnapshot ?? {}) as object,
        metadata: (input.metadata ?? {}) as object,
        ipAddress: input.ipAddress,
      },
    });
  }
}
