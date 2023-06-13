// export class CreateIncidentMasterDto {}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateIncidentMasterDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  incidentName: string;
}
