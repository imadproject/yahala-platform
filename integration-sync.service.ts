import { Injectable } from '@nestjs/common';
import { Citizen360AggregatorService } from '../common/engines/citizen360-aggregator.service';

@Injectable()
export class Citizen360Service {
  constructor(private readonly aggregator: Citizen360AggregatorService) {}

  get(citizenId: string) {
    return this.aggregator.getCitizen360(citizenId);
  }
}
