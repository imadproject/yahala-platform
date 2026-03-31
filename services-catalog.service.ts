import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CitizensService } from './citizens.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('citizens')
@UseGuards(JwtAuthGuard)
export class CitizensController {
  constructor(private readonly citizensService: CitizensService) {}

  @Get()
  findAll() {
    return this.citizensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citizensService.findOne(id);
  }
}
