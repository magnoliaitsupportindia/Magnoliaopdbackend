import { Module } from '@nestjs/common';
import { DrugMasterService } from './drug_master.service';
import { DrugMasterController } from './drug_master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { DrugMaster } from './entities/drug_master.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserManagement, DrugMaster,Company])],
  controllers: [DrugMasterController],
  providers: [DrugMasterService],
})
export class DrugMasterModule {}
