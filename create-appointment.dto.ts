import { IsOptional, IsString } from 'class-validator';

export class TransferOwnershipDto {
  @IsString()
  fromCitizenId!: string;

  @IsString()
  toCitizenId!: string;

  @IsOptional()
  @IsString()
  legalBasisRecordId?: string;
}
