import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateRolemanagementDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  roleName: string;
}
