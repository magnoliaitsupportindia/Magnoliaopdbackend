import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  enterpriseEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  mobile: string; 

  @ApiProperty()
  readonly websiteUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  enterprisesType: number;

  @ApiProperty()
  @IsNotEmpty()
  state: number

  @ApiProperty()
  @IsNotEmpty()
  city: number

  @ApiProperty()
  @IsNotEmpty()
  address: string
}
export class CreateCompanyEmployeeTypeDto{
  @ApiProperty()
  @IsNotEmpty()
  employeeType: string;
}

export class CreateStateDto{
  @ApiProperty()
  @IsNotEmpty()
  state: string;
}

export class CreateCityDto{
  @ApiProperty()
  @IsNotEmpty()
  state: number;

  @ApiProperty()
  @IsNotEmpty()
  city: string;
}

export class CreateIndustryTypeDto{
  @ApiProperty()
  @IsNotEmpty()
  enterpriseType: string;
}

export const docFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(svg|png|jpg|jpeg)$/)) {
    return callback(
      req.res.status(400).send({
        statusCode: 400,
        message: ["Only .docx, .png, .pdf ,.jpg ,.jpeg files are allowed!"],
        error: "Bad Request",
      }),
      false
    );
  }
  callback(null, true);
};