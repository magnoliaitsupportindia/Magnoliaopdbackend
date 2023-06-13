// export class CreateDesignationMasterDto {}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateDesignationMasterDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  designationName: string;
}
