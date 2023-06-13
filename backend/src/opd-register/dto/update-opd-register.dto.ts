import { PartialType } from '@nestjs/swagger';
import { CreateOpdRegisterDto } from './create-opd-register.dto';

export class UpdateOpdRegisterDto extends PartialType(CreateOpdRegisterDto) {}
