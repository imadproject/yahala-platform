import { IsDateString, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  appointmentType!: string;

  @IsString()
  relatedObjectType!: string;

  @IsString()
  relatedObjectId!: string;

  @IsString()
  hostEntityId!: string;

  @IsString()
  citizenId!: string;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsString()
  locationMode!: string;

  @IsString()
  locationDetails!: string;
}
