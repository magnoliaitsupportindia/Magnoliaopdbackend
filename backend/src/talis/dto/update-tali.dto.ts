import { PartialType } from '@nestjs/swagger';
import { CreateTaliDto } from './create-tali.dto';

export class UpdateTaliDto extends PartialType(CreateTaliDto) {}
