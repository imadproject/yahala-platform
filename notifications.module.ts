import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RequestState } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestsService } from './requests.service';

@Controller('requests')
@UseGuards(JwtAuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  list(@Query('citizenId') citizenId?: string) {
    return this.requestsService.list(citizenId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.requestsService.get(id);
  }

  @Post()
  create(@Body() dto: CreateRequestDto) {
    return this.requestsService.create(dto);
  }

  @Patch(':id/state')
  transition(@Param('id') id: string, @Body() body: { next: RequestState; reason?: string }) {
    return this.requestsService.transition(id, body.next, body.reason);
  }
}
