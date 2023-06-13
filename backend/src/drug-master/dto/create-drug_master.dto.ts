import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateDrugMasterDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  drugName: string;
}
