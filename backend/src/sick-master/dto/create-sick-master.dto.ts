import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateSickMasterDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  sickName: string;
}
