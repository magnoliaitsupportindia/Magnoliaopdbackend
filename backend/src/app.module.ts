import { Module, MiddlewareConsumer } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { UserManagementModule } from './user-management/user-management.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { employee } from './employee/entities/employee.entity';
import { UserManagement } from './user-management/entities/user-management.entity';
import { DrugMasterModule } from './drug-master/drug_master.module';
import { DrugMaster } from './drug-master/entities/drug_master.entity';
import { SickMasterModule } from './sick-master/sick-master.module';
import { DepartmentMasterModule } from './department-master/department-master.module';
import { HospitalMasterModule } from './hospital-master/hospital-master.module';
import { RolemanagementModule } from './rolemanagement/rolemanagement.module';
import { DesignationMasterModule } from './designation-master/designation-master.module';
import { DepartmentMaster } from './department-master/entities/department-master.entity';
import { DesignationMaster } from './designation-master/entities/designation-master.entity';
import { HospitalMaster } from './hospital-master/entities/hospital-master.entity';
import { IncidentMaster } from './incident-master/entities/incident-master.entity';
import { Rolemanagement } from './rolemanagement/entities/rolemanagement.entity';
import { SickMaster } from './sick-master/entities/sick-master.entity';
import { VendorMasterModule } from './vendor-master/vendor-master.module';
import { IncidentMasterModule } from './incident-master/incident-master.module';
import { VendorMaster } from './vendor-master/entities/vendor-master.entity';
import { CompanyModule } from './company/company.module';
import {Company,companyEmployeeTypeMapping,stateList,cityList, typeOfEnterprises} from './company/entities/company.entity';
import { OpdRegisterModule } from './opd-register/opd-register.module';
import {OpdRegister,optDrugMap,optsickMap,visitors} from './opd-register/entities/opd-register.entity';
import { TalisModule } from './talis/talis.module';
import {moduleTable,subModule,screens,masterReportTail} from './talis/entities/tali.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        employee,
        UserManagement,
        DrugMaster,
        DepartmentMaster,
        DesignationMaster,
        HospitalMaster,
        IncidentMaster,
        Rolemanagement,
        SickMaster,
        VendorMaster,
        Company,
        optsickMap,
        OpdRegister,
        optDrugMap,
        visitors,
        moduleTable,
        subModule,
        screens,
        masterReportTail,
        companyEmployeeTypeMapping,
        typeOfEnterprises,
        stateList,
        cityList
      ],
    }),

    WinstonModule.forRoot({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
          return `${info.timestamp} [${info.level}] : ${info.message}`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'logs/activity.log', level: 'info' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    }),

    EmployeeModule,
    UserManagementModule,
    DrugMasterModule,
    SickMasterModule,
    DepartmentMasterModule,
    HospitalMasterModule,
    RolemanagementModule,
    DesignationMasterModule,
    VendorMasterModule,
    IncidentMasterModule,
    CompanyModule,
    TalisModule,
    OpdRegisterModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../frontend/'),
      exclude: ['/api*'],
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
