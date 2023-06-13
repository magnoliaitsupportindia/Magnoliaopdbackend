import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { employee } from './entities/employee.entity';
import { DepartmentMaster } from 'src/department-master/entities/department-master.entity';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { Company } from 'src/company/entities/company.entity';
import { DesignationMaster } from 'src/designation-master/entities/designation-master.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([employee, UserManagement, DepartmentMaster,Company,DesignationMaster]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
