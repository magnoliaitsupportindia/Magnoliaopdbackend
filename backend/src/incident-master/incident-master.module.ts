import { Module } from '@nestjs/common';
import { IncidentMasterService } from './incident-master.service';
import { IncidentMasterController } from './incident-master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { IncidentMaster } from './entities/incident-master.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserManagement, IncidentMaster,Company])],
  controllers: [IncidentMasterController],
  providers: [IncidentMasterService],
})
export class IncidentMasterModule {}
