import { PartialType } from '@nestjs/swagger';
import { CreateSickMasterDto } from './create-sick-master.dto';

export class UpdateSickMasterDto extends PartialType(CreateSickMasterDto) {}
