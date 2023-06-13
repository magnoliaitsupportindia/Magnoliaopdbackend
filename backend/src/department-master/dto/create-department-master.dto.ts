import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
export class CreateDepartmentMasterDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  departmentName: string;
}
