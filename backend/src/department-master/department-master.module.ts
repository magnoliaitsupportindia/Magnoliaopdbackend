import { Module } from '@nestjs/common';
import { DepartmentMasterService } from './department-master.service';
import { DepartmentMasterController } from './department-master.controller';
import { Company } from 'src/company/entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { DepartmentMaster } from './entities/department-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserManagement, DepartmentMaster,Company])],
  controllers: [DepartmentMasterController],
  providers: [DepartmentMasterService],
})
export class DepartmentMasterModule {}
