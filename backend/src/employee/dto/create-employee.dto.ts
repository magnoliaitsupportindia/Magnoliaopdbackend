import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  firstName: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @Length(2, 100)
  // lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  // @IsNumber()
  @Length(10, 15)
  contactNum: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // // @IsNumber()
  // @Length(10, 15)
  // emergencyNum: string;

  @ApiProperty()
  @IsNotEmpty()
  empId: string;

  @ApiProperty()
  @IsNotEmpty()
  gender: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsNumber()
  // enterprise: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  designation: number;

  @ApiProperty()
  @IsNotEmpty()
  dob: Date; 

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  department: number;

  @ApiProperty()
  // @IsNotEmpty()
  bloodgrp: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // employeeType: number;
}
