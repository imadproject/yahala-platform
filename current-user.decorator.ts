import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';

@Controller('cases')
@UseGuards(JwtAuthGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  list(@Query('citizenId') citizenId?: string) {
    return this.casesService.list(citizenId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.casesService.get(id);
  }

  @Post()
  create(@Body() dto: CreateCaseDto) {
    return this.casesService.create(dto);
  }
}
