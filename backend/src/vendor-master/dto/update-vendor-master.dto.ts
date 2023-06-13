import { PartialType } from '@nestjs/swagger';
import { CreateVendorMasterDto } from './create-vendor-master.dto';

export class UpdateVendorMasterDto extends PartialType(CreateVendorMasterDto) {}
