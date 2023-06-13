import { PartialType } from '@nestjs/swagger';
import { CreateRolemanagementDto } from './create-rolemanagement.dto';

export class UpdateRolemanagementDto extends PartialType(CreateRolemanagementDto) {}
