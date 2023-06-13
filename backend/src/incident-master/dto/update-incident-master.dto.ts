import { PartialType } from '@nestjs/swagger';
import { CreateIncidentMasterDto } from './create-incident-master.dto';

export class UpdateIncidentMasterDto extends PartialType(CreateIncidentMasterDto) {}
