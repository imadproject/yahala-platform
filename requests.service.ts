import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('entities')
@UseGuards(JwtAuthGuard)
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  list() {
    return this.entitiesService.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.entitiesService.get(id);
  }
}
