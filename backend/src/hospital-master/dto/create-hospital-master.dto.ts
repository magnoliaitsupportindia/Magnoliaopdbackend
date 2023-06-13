// export class CreateHospitalMasterDto {}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateHospitalMasterDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  hospitalName: string;

  @ApiProperty()
  @IsNotEmpty()
  contact: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  location: string;
}
