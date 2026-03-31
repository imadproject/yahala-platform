import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AssetsService } from './assets.service';
import { TransferOwnershipDto } from './dto/transfer-ownership.dto';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  list(@Query('citizenId') citizenId?: string) {
    return this.assetsService.list(citizenId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.assetsService.get(id);
  }

  @Post(':id/transfer')
  transfer(@Param('id') id: string, @Body() dto: TransferOwnershipDto) {
    return this.assetsService.transferOwnership(id, dto);
  }
}
