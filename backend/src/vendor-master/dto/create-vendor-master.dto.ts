import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateVendorMasterDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  vendorName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 100)
  purposeOfVendor: string;
}
