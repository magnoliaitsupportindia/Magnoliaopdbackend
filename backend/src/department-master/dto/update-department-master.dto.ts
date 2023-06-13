import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentMasterDto } from './create-department-master.dto';

export class UpdateDepartmentMasterDto extends PartialType(
  CreateDepartmentMasterDto,
) {}
