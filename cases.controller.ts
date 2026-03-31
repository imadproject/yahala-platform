import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestState } from '@prisma/client';
import { AuditService } from '../common/audit/audit.service';
import { DependenciesService } from '../common/engines/dependencies.service';
import { NotificationEventService } from '../common/engines/notification-event.service';
import { StateManagerService } from '../common/engines/state-manager.service';
import { WorkflowService } from '../common/engines/workflow.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dependenciesService: DependenciesService,
    private readonly workflowService: WorkflowService,
    private readonly stateManager: StateManagerService,
    private readonly notifications: NotificationEventService,
    private readonly audit: AuditService,
  ) {}

  list(citizenId?: string) {
    return this.prisma.serviceRequest.findMany({
      where: citizenId ? { citizenId } : undefined,
      include: { service: true, workflowTasks: true, approvalTasks: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  get(id: string) {
    return this.prisma.serviceRequest.findUniqueOrThrow({
      where: { id },
      include: { service: true, workflowTasks: true, approvalTasks: true, records: true, appointments: true },
    });
  }

  async create(dto: CreateRequestDto) {
    const eligibility = await this.dependenciesService.evaluateServiceEligibility(dto.citizenId, dto.serviceId);
    if (!eligibility.allowed) {
      throw new BadRequestException(`Service blocked: ${eligibility.blockingReason}`);
    }

    const requestNumber = `YH-${Date.now()}`;
    const workflowInstance = this.workflowService.instantiate(eligibility.service.workflowTemplate);

    const request = await this.prisma.serviceRequest.create({
      data: {
        requestNumber,
        serviceId: dto.serviceId,
        citizenId: dto.citizenId,
        requesterUserId: dto.requesterUserId,
        targetEntityId: dto.targetEntityId ?? eligibility.service.ownerEntityId,
        subjectReference: dto.subjectReference,
        submissionChannel: dto.submissionChannel,
        submittedPayloadSnapshot: dto.payload,
        workflowInstance,
        requestState: 'PENDING_VERIFICATION',
        currentStepCode: 'INITIAL_REVIEW',
      },
    });

    await this.workflowService.createInitialTask(request.id, request.targetEntityId ?? undefined);
    await this.audit.log({
      actorUserId: dto.requesterUserId,
      actionCode: 'REQUEST_CREATED',
      objectType: 'ServiceRequest',
      objectId: request.id,
      objectSnapshot: request,
    });

    return request;
  }

  async transition(id: string, next: RequestState, reason?: string) {
    const request = await this.prisma.serviceRequest.findUniqueOrThrow({ where: { id } });
    this.stateManager.assertRequestTransition(request.requestState, next);

    const updated = await this.prisma.serviceRequest.update({
      where: { id },
      data: {
        requestState: next,
        stateReason: reason,
        decisionOutcome: next === 'APPROVED' ? 'SUCCESS' : next === 'REJECTED' ? 'REJECTED' : request.decisionOutcome,
        closedAt: ['APPROVED', 'REJECTED', 'CANCELLED', 'CLOSED'].includes(next) ? new Date() : null,
      },
    });

    await this.notifications.send({
      recipientUserId: request.requesterUserId,
      type: next === 'REJECTED' ? 'ACTION_REQUIRED' : 'INFORMATIONAL',
      title: `Request ${updated.requestNumber} moved to ${next}`,
      body: reason ?? 'Request state updated.',
      sourceObjectType: 'ServiceRequest',
      sourceObjectId: id,
      requestId: id,
      actionRequired: next === 'PENDING_COMPLETION',
    });

    return updated;
  }
}
