import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Length, ValidateIf } from 'class-validator';

export class CreateOpdRegisterDto {

  @ApiProperty()
  @IsNotEmpty()
  care: string;

  @ApiProperty()
  @ValidateIf((object, value) => value !== null)
  drugId: number[] | null;

  @ApiProperty()
  @ValidateIf((object, value) => value !== null)
  complaintsId: number[]  | null;

  @ApiProperty()
  @ValidateIf((object, value) => value !== null)
  complaintsType: number  | null;


  @ApiProperty()
  @ValidateIf((object, value) => value !== null)
  hospitalId: number  | null;

  @ApiProperty()
  @IsNotEmpty()
  empId: number;
}
export class visitorsDto{

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  visitorName: string;

  @ApiProperty()
  @IsNotEmpty()
  care: string;

  @ApiProperty()
  @ValidateIf((object, value) => value !== null)
  drugId: number[] | null;

  @ApiProperty()
  @IsNotEmpty()
  contactNumber:string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  contactPerson: number;

  @ApiProperty()
  @ValidateIf((object, value) => value !== null)
  complaintsId: number[]  | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  department: number;

  @ApiProperty()
  @ValidateIf((object, value) => value !== null)
  complaintsType: number  | null;

  @ApiProperty()
  @ValidateIf((object, value) => value !== null)
  hospitalId: number  | null;
}

