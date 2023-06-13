import { Module } from '@nestjs/common';
import { SickMasterService } from './sick-master.service';
import { SickMasterController } from './sick-master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { SickMaster } from './entities/sick-master.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserManagement, SickMaster])],
  controllers: [SickMasterController],
  providers: [SickMasterService],
})
export class SickMasterModule {}
