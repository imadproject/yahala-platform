import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  canReadCitizen(actor: { userType: string; linkedEntityId?: string | null }, citizenId: string) {
    if (actor.userType === 'PLATFORM_ADMIN' || actor.userType === 'CITIZEN') return true;
    return Boolean(actor.linkedEntityId && citizenId);
  }

  assertAction(condition: boolean, message: string) {
    if (!condition) throw new ForbiddenException(message);
  }
}
