import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  instantiate(template: unknown) {
    return {
      version: '1.0',
      startedAt: new Date().toISOString(),
      template,
      currentStepCode: 'INITIAL_REVIEW',
    };
  }

  async createInitialTask(requestId: string, assignedEntityId?: string) {
    return this.prisma.workflowTask.create({
      data: {
        requestId,
        stepCode: 'INITIAL_REVIEW',
        stepName: 'Initial Review',
        assignedEntityId,
        status: 'ACTIVE',
        metadata: {},
      },
    });
  }

  async completeTask(taskId: string, decisionNote?: string) {
    return this.prisma.workflowTask.update({
      where: { id: taskId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        decisionNote,
      },
    });
  }
}
