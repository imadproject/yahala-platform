import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationEventService {
  constructor(private readonly prisma: PrismaService) {}

  async send(input: {
    recipientUserId: string;
    type: NotificationType;
    title: string;
    body: string;
    sourceObjectType: string;
    sourceObjectId: string;
    actionRequired?: boolean;
    requestId?: string;
    caseId?: string;
  }) {
    return this.prisma.notification.create({
      data: {
        recipientUserId: input.recipientUserId,
        recipientType: 'USER',
        notificationType: input.type,
        sourceObjectType: input.sourceObjectType,
        sourceObjectId: input.sourceObjectId,
        messageTitle: input.title,
        messageBody: input.body,
        deliveryChannel: 'IN_APP',
        actionRequiredFlag: input.actionRequired ?? false,
        requestId: input.requestId,
        caseId: input.caseId,
      },
    });
  }
}
