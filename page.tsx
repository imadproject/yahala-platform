import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestState } from '@prisma/client';

const REQUEST_TRANSITIONS: Record<RequestState, RequestState[]> = {
  DRAFT: ['PENDING_VERIFICATION', 'CANCELLED'],
  PENDING_VERIFICATION: ['IN_REVIEW', 'REJECTED', 'CANCELLED'],
  IN_REVIEW: ['PENDING_APPROVAL', 'PENDING_COMPLETION', 'APPROVED', 'REJECTED', 'CANCELLED'],
  PENDING_APPROVAL: ['IN_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED'],
  PENDING_COMPLETION: ['IN_REVIEW', 'REJECTED', 'CANCELLED'],
  APPROVED: ['CLOSED'],
  REJECTED: ['CLOSED'],
  CANCELLED: ['CLOSED'],
  CLOSED: [],
};

@Injectable()
export class StateManagerService {
  assertRequestTransition(current: RequestState, next: RequestState) {
    if (!REQUEST_TRANSITIONS[current].includes(next)) {
      throw new BadRequestException(`Invalid request state transition from ${current} to ${next}`);
    }
  }
}
