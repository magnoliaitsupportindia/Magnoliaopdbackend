import { PartialType } from '@nestjs/swagger';
import { CreateDesignationMasterDto } from './create-designation-master.dto';

export class UpdateDesignationMasterDto extends PartialType(CreateDesignationMasterDto) {}
