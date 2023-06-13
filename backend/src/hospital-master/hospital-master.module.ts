import { Module } from '@nestjs/common';
import { HospitalMasterService } from './hospital-master.service';
import { HospitalMasterController } from './hospital-master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { HospitalMaster } from './entities/hospital-master.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserManagement, HospitalMaster,Company])],
  controllers: [HospitalMasterController],
  providers: [HospitalMasterService],
})
export class HospitalMasterModule {}
