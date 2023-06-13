import { Module } from '@nestjs/common';
import { VendorMasterService } from './vendor-master.service';
import { VendorMasterController } from './vendor-master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorMaster } from './entities/vendor-master.entity';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendorMaster,UserManagement,Company])],
  controllers: [VendorMasterController],
  providers: [VendorMasterService],
})
export class VendorMasterModule {}
