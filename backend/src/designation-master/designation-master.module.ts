import { Module } from '@nestjs/common';
import { DesignationMasterService } from './designation-master.service';
import { DesignationMasterController } from './designation-master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { DesignationMaster } from './entities/designation-master.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserManagement, DesignationMaster,Company])],
  controllers: [DesignationMasterController],
  providers: [DesignationMasterService],
})
export class DesignationMasterModule {}
