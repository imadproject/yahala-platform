import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  serviceId!: string;

  @IsString()
  citizenId!: string;

  @IsString()
  requesterUserId!: string;

  @IsOptional()
  @IsString()
  targetEntityId?: string;

  @IsOptional()
  @IsString()
  subjectReference?: string;

  @IsString()
  submissionChannel!: string;

  @IsObject()
  payload!: Record<string, unknown>;
}
