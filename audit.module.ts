import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Citizen360Service } from './citizen360.service';

@Controller('citizen-360')
@UseGuards(JwtAuthGuard)
export class Citizen360Controller {
  constructor(private readonly citizen360Service: Citizen360Service) {}

  @Get(':citizenId')
  get(@Param('citizenId') citizenId: string) {
    return this.citizen360Service.get(citizenId);
  }
}
