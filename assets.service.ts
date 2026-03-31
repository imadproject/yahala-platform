import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ServicesCatalogService } from './services-catalog.service';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesCatalogController {
  constructor(private readonly servicesCatalogService: ServicesCatalogService) {}

  @Get()
  list() {
    return this.servicesCatalogService.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.servicesCatalogService.get(id);
  }
}
