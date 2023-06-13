import { Module } from '@nestjs/common';
import { RolemanagementService } from './rolemanagement.service';
import { RolemanagementController } from './rolemanagement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { Rolemanagement } from './entities/rolemanagement.entity';
import { Company } from 'src/company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserManagement, Rolemanagement,Company])],
  controllers: [RolemanagementController],
  providers: [RolemanagementService],
})
export class RolemanagementModule {}
