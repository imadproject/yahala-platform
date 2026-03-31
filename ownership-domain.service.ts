import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  list(citizenId?: string) {
    return this.prisma.appointment.findMany({ where: citizenId ? { citizenId } : undefined, orderBy: { startsAt: 'desc' } });
  }

  async create(dto: CreateAppointmentDto) {
    const overlap = await this.prisma.appointment.findFirst({
      where: {
        citizenId: dto.citizenId,
        status: { in: ['BOOKED', 'CONFIRMED', 'RESCHEDULED'] },
        OR: [
          { startsAt: { lte: new Date(dto.startsAt) }, endsAt: { gt: new Date(dto.startsAt) } },
          { startsAt: { lt: new Date(dto.endsAt) }, endsAt: { gte: new Date(dto.endsAt) } },
        ],
      },
    });
    if (overlap) throw new BadRequestException('Conflicting appointment exists');

    return this.prisma.appointment.create({
      data: {
        appointmentType: dto.appointmentType,
        relatedObjectType: dto.relatedObjectType,
        relatedObjectId: dto.relatedObjectId,
        hostEntityId: dto.hostEntityId,
        citizenId: dto.citizenId,
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        locationMode: dto.locationMode,
        locationDetails: dto.locationDetails,
      },
    });
  }
}
