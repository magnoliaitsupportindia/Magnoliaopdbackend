import { PartialType } from '@nestjs/swagger';
import { CreateDrugMasterDto } from './create-drug_master.dto';

export class UpdateDrugMasterDto extends PartialType(CreateDrugMasterDto) {}
