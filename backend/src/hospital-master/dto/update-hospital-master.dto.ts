import { PartialType } from '@nestjs/swagger';
import { CreateHospitalMasterDto } from './create-hospital-master.dto';

export class UpdateHospitalMasterDto extends PartialType(CreateHospitalMasterDto) {}
