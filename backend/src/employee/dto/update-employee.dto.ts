/* eslint-disable @typescript-eslint/no-unused-vars */
import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Length,
  IsNumber,
} from 'class-validator';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
export class employee {
  // @ApiProperty()
  @IsNotEmpty()
  //   @IsNumber()
  //   @IsEmail()
  name: any;
}
