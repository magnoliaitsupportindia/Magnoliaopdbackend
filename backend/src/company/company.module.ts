import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { cityList, Company, stateList, typeOfEnterprises } from './entities/company.entity';
import {companyEmployeeTypeMapping} from './entities/company.entity'
import { CommunicationService } from 'src/communication';

@Module({
  imports: [TypeOrmModule.forFeature([UserManagement, Company,companyEmployeeTypeMapping,stateList,typeOfEnterprises,cityList])],
  controllers: [CompanyController],
  providers: [CompanyService,CommunicationService],
})
export class CompanyModule {}
