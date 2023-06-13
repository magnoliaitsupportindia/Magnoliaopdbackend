import { Module } from '@nestjs/common';
import { OpdRegisterService } from './opd-register.service';
import { OpdRegisterController } from './opd-register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { optDrugMap, OpdRegister,optsickMap,visitors } from './entities/opd-register.entity';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { employee } from 'src/employee/entities/employee.entity';
import { SickMaster } from 'src/sick-master/entities/sick-master.entity';
import { DrugMaster } from 'src/drug-master/entities/drug_master.entity';
import { DepartmentMaster } from 'src/department-master/entities/department-master.entity';
import { Company } from 'src/company/entities/company.entity';
import { DesignationMaster } from 'src/designation-master/entities/designation-master.entity';
import { HospitalMaster } from 'src/hospital-master/entities/hospital-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OpdRegister,optDrugMap,UserManagement,
  optsickMap,employee,SickMaster,DrugMaster,DepartmentMaster,Company,DesignationMaster,visitors,HospitalMaster])],
  controllers: [OpdRegisterController],
  providers: [OpdRegisterService]
})
export class OpdRegisterModule {}
// optDrugMap,
