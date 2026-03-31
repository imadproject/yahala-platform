import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  caseNumber!: string;

  @IsString()
  caseType!: string;

  @IsString()
  courtEntityId!: string;

  @IsOptional()
  @IsString()
  primaryCitizenId?: string;

  @IsObject()
  partiesSnapshot!: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  linkedAssetIds?: string[];
}
