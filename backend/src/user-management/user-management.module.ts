import { Module } from '@nestjs/common';
// import { PassportModule } from '@nestjs/passport';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserManagement } from './entities/user-management.entity';
import { Rolemanagement } from 'src/rolemanagement/entities/rolemanagement.entity';
import { Company } from 'src/company/entities/company.entity';
import { config } from 'rxjs';
// import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserManagement, Company, Rolemanagement]),
  ],
  controllers: [UserManagementController],
  providers: [UserManagementService]
})
export class UserManagementModule {}





// import:[
   // PassportModule,
    // JwtModule.register({
    //   // secret: 'af0rapp1e',
    //   signOptions: { expiresIn: '10d' },
    // })]