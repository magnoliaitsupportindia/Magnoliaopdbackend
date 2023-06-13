import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Length } from 'class-validator';
export class CreateUserManagementDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  // @IsNumber()
  @Length(10, 15)
  mobile: string;

  @ApiProperty()
  @IsNotEmpty()
  empId: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // gender: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsNumber()
  // company: number;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsNumber()
  // empID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  role: number;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;
}
export class loginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
// export class LoginDto {
//   @ApiProperty()
//   readonly email: string;

//   @ApiProperty()
//   readonly password: string;
// }
