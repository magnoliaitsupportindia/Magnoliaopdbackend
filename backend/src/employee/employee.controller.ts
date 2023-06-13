import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  forwardRef,
  Inject,
  Req,
  Res,
  HttpStatus,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmployeeService } from './employee.service';
import express, { Request, Response } from 'express';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { resourceLimits } from 'worker_threads';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { diskStorage } from 'multer';
import * as XLSX from 'xlsx';
import * as path from 'path';
import { employee } from './entities/employee.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { Index } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};
@ApiTags('employee')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('employee')
export class EmployeeController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly employeeManagementService: EmployeeService,
  ) {}
  @Get('signUpData')
  async signUpData(@Req() req: Request, @Res() res: Response) {
    try {
      let company = req['user']['company'];
      let getUser = await this.employeeManagementService.signUpData(company);
      this.logger.info(
        `succesfully getting employee onbaording detail:employee/signUpData`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All employee onboard details',
        data: getUser,
      });
    } catch (error) {
      this.logger.error(`error in in getting employee onboard data:`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting emloyee onboard details',
      });
    }
  }
  @Post('addNewEmployee')
  async addEmployee(
    @Body() data: CreateEmployeeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let signData = {
        createdBy: req['user']['id'],
        company: req['user']['company'],
      };
      let dataEmp = await this.employeeManagementService.addEmployee(data,signData);
      if (dataEmp.status) {
        this.logger.info(`addEmployee : employee saved - ${data.firstName} ${data.empId}`);
        res.status(HttpStatus.OK).json({
          success: dataEmp.status,
          message: dataEmp.message,
        });
      } else {
        this.logger.warn(`addEmployee : Error in creating Employee -${data.empId}`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: dataEmp.status,
          message: dataEmp.message,
        });
      }
    } catch (error) {
      this.logger.error(`addEmployee : Error in creating employee ${data.empId}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating employee',
      });
    }
  }

  @Get('getAllEmployee')
  async getAllEmployee(@Req() req: Request, @Res() res: Response) {
    try {
      let companyDetail = req['user']['company'];
      let getEmp = await this.employeeManagementService.getAllEmployee(
        companyDetail,
      );
      this.logger.info(`getting all employees list : getAllEmployee`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Employeess',
        data: getEmp,
      });
    } catch (error) {
      this.logger.error(`error in getting all employee: getAllEMployee`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Employee',
      });
    }
  }

  @Get('getAllNonEmployee')
  async getAllNonEmployee(@Req() req: Request, @Res() res: Response) {
    try {
      let companyDetail = req['user']['company'];
      let getEmp = await this.employeeManagementService.getAllNonEmployee(
        companyDetail,
      );
      this.logger.info(`getting all employees list : getAllNonEmployee`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Non Employeess',
        data: getEmp,
      });
    } catch (error) {
      this.logger.error(`error in getting all employee: getAllNonEMployee`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Non Employee',
      });
    }
  }

  @Get('getEmployeeById/:id')
  async getEmployeeById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getByEmpId = await this.employeeManagementService.getEmployeeById(id);
      this.logger.info(`getting employee :getEmployeeById/id ${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Employee detail',
        data: getByEmpId,
      });
    } catch (error) {
      this.logger.error(
        `getting employee have error:getEmployeeById/id ${id}`,
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Employee',
      });
    }
  }

  @Get('getNonEmployeeById/:id')
  async getNonEmployeeById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getByEmpId = await this.employeeManagementService.getNonEmployeeById(id);
      this.logger.info(`getting employee :getNonEmployeeById/id ${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Employee detail',
        data: getByEmpId,
      });
    } catch (error) {
      this.logger.error(
        `getting employee have error:getNonEmployeeById/id ${id}`,
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Non Employee',
      });
    }
  }

  @Delete('deleteEmployee/:id')
  async deleteEmployee(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      let dltByEmpId = await this.employeeManagementService.deleteEmployee(
        id,
        user,
      );
      this.logger.info(`delete an employee : deleteEmployee/id-${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an employee',
      });
    } catch (error) {
      this.logger.error(
        `error in delete employee : deleteEmployee/id ${id}`,
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an employee',
      });
    }
  }

  @Put('editEmployeeDetails/:id')
  async editEmployeeDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateEmployeeDto,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      let company=req['user']['company']
      let editEmpById = await this.employeeManagementService.editEmployeeDetails(data,id,user,company);
      this.logger.info(
        `employee edit successfully : editEmloyeeDetails/id-${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Employee Details',
      });
    } catch (error) {
      this.logger.error(
        `employee edit have error : editEmloyeeDetails/id-${id}`,
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Edit Employee Details',
      });
    }
  }

  @Get('empIdLen')
  async empIdGen(@Req() req: Request, @Res() res: Response) {
    try {
      let getEmp = await this.employeeManagementService.empIdGen();
      this.logger.info(`empId creation api run successfully`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting empId Length',
        data: getEmp,
      });
    } catch (error) {
      this.logger.error(`error in getting employee id length`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting length',
      });
    }
  }

  @Get('getEmployeeByDept/:id')
  async getEmployeeByDept(@Req() req: Request, @Res() res: Response,@Param('id') id: number,) {
    try {
      let company =req['user']['company']
      let getEmp = await this.employeeManagementService.getEmpByDept(id,company);
      this.logger.info(`Department wise employee getting API successfully`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting empId Length',
        data: getEmp,
      });
    } catch (error) {
      this.logger.error(`error in getting employee id length`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting length',
      });
    }
  }

  @Post('uploadEmp')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/employee/',
        filename: fileName,
      }),
    }),
  )
  async uploadEmp(
    @UploadedFile() file,
    @Body() data: employee,
    @Req() req: Request,
    @Res() res: Response,
    ) {
    try {
      let comId=req['user']['company'];
      let empEmailList = [];
      let empEmail = await this.employeeManagementService.getAllEmail(comId);
      empEmail.forEach((e) => {
        empEmailList.push(e['email']);
      });

      let descDetails = {};
      let designation = await this.employeeManagementService.getalldesc(comId);
      designation.forEach((e) => {
        descDetails[e['designationName'].toLowerCase()] = e['id'];
      });

      let deptDetails = {};
      let department = await this.employeeManagementService.getalldept(comId);
      department.forEach((ele) => {
        deptDetails[ele['departmentName'].toLowerCase()] = ele['id'];
      });
      let files = XLSX.readFile(file.path);
      let sheetName = files.Props.SheetNames[0];
      const temp = XLSX.utils.sheet_to_json(files.Sheets[sheetName]);
      let email = [];
      for (let i = 0; i < temp.length; i++) {
        email.push(temp[i]['email']);
        if (
          typeof temp[i]['firstName'] == 'string' &&
          typeof temp[i]['location'] == 'string' &&
          typeof temp[i]['gender'] == 'string' &&
          typeof temp[i]['designation'] == 'string' &&
          typeof temp[i]['department'] == 'string' &&
          typeof temp[i]['bloodGroup'] == 'string' &&
          typeof temp[i]['mobile'] == 'number'
        ) {
          temp[i]['designation'] = descDetails[temp[i]['designation'].toLowerCase()];
          temp[i]['employeeType'] = 1;
          temp[i]['company'] = comId;
          temp[i]['createdBy'] = req['user']['id']
          temp[i]['department'] = deptDetails[temp[i]['department'].toLowerCase()];
          if(temp[i]['lastName']==null){
            temp[i]['lastName']=''
          }
        } else {
          this.logger.warn(
            `employee bulk upload execl sheet have error: uploadEmp`,
          );
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid employees data Upload',
          });
        }
      }
      email.forEach((e) => {
        if (empEmailList.includes(e)) {
        }
      });
      if (temp.length) {
        let uploadEmp = await this.employeeManagementService.bulkUpload(temp);
        this.logger.info(`employee bulk upload successfully: uploadEmp`);
        res.status(HttpStatus.OK).json({
          success: uploadEmp.status,
          message: uploadEmp.message,
        });
      } else {
        this.logger.warn(`employee bulk upload data error: uploadEmp`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadEmp', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in employee Upload',
      });
    }
  }

  @Post('uploadNonEmp')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/employee/',
        filename: fileName,
      }),
    }),
  )
  async uploadNonEmp(
    @UploadedFile() file,
    @Body() data: employee,
    @Req() req: Request,
    @Res() res: Response,
    ) {
    try {
      let comId =req['user']['company']
      let empEmailList = [];
      let empEmail = await this.employeeManagementService.getAllEmail(comId);
      empEmail.forEach((e) => {
        empEmailList.push(e['email']);
      });

      let descDetails = {};
      let designation = await this.employeeManagementService.getalldesc(comId);
      designation.forEach((e) => {
        descDetails[e['designationName'].toLowerCase()] = e['id'];
      });

      let vendor = {};
      let vendorDetails = await this.employeeManagementService.getallVendor(comId);
      vendorDetails.forEach((e) => {
        vendor[e['vendorName'].toLowerCase()] = e['id'];
      });

      let deptDetails = {};
      let department = await this.employeeManagementService.getalldept(comId);
      department.forEach((ele) => {
        deptDetails[ele['departmentName'].toLowerCase()] = ele['id'];
      });

      let files = XLSX.readFile(file.path);
      let sheetName = files.Props.SheetNames[0];
      const temp = XLSX.utils.sheet_to_json(files.Sheets[sheetName]);
      let email = [];
      for (let i = 0; i < temp.length; i++) {
        email.push(temp[i]['email']);
        if (
          typeof temp[i]['firstName'] == 'string' &&
          typeof temp[i]['location'] == 'string' &&
          typeof temp[i]['gender'] == 'string' &&
          typeof temp[i]['designation'] == 'string' &&
          typeof temp[i]['department'] == 'string' &&
          typeof temp[i]['bloodGroup'] == 'string' &&
          typeof temp[i]['mobile'] == 'number'
        ) {
          temp[i]['designation'] = descDetails[temp[i]['designation'].toLowerCase()];
          temp[i]['vendorId'] = vendor[temp[i]['vendorId'].toLowerCase()];
          temp[i]['department'] = deptDetails[temp[i]['department'].toLowerCase()];
          temp[i]['employeeType'] = 2;
          temp[i]['company'] = comId;
          temp[i]['createdBy'] = req['user']['id']
          if(temp[i]['lastName']==null){
            temp[i]['lastName']=''
          }
        } else {
          this.logger.warn(
            `employee bulk upload execl sheet have error: uploadEmp`,
          );
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid employees data Upload',
          });
        }
      }
      email.forEach((e) => {
        if (empEmailList.includes(e)) {
        }
      });
      if (temp.length) {
        let uploadEmp = await this.employeeManagementService.bulkUpload(temp);
        this.logger.info(`employee bulk upload successfully: uploadEmp`);
        res.status(HttpStatus.OK).json({
          success: uploadEmp.status,
          message: uploadEmp.message,
        });
      } else {
        this.logger.warn(`employee bulk upload data error: uploadEmp`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadEmp', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in employee Upload',
      });
    }
  }
}

// temp.forEach(function(data) {
//   if(typeof data['firstname']=='string'  && typeof data['lastname'] =='string' && typeof data['location']=='string' &&
//    typeof data['gender']=='string' &&typeof data['designation']=='string' && typeof data['company']=='string' && typeof data['department']=='string' &&
//    typeof data['empId']=='string' &&typeof data['bloodGroup']=='string' && typeof data['mobile']=='number'){
//   }else{
//   //   res.status(HttpStatus.BAD_REQUEST).json({
//   //     success: false,
//   //     message:'Invalid employee data Upload'
//   //  })
//   }
// });

// temp[i]['designation']=descdetails[temp[i]['designation'].toLowerCase()]

// let desc=e['designationName'];let id=e['id']
// let a=e['designationName']:e['id'];

// var department  = {[ele[index].department , ele[index].id]};
//   for(let i in department){

// const emp: CreateEmployeeDto[] = plainToClass(
//   CreateEmployeeDto,
//   temp,
//   // 'emp',
//   { excludeExtraneousValues: false},
//  );

//  const validatorOptions: ValidatorOptions = {
//     whitelist: true, // strips all properties that don't have any decorators
//     skipMissingProperties: false,
//     forbidUnknownValues: true,
//     validationError: {
//        target: false,
//        value: false,
//     },
//  };

//   let data=[]
//   temp.forEach((res) => {
//     data.push(res)
//  })

//  const errors = await validate(employee, validatorOptions);
// this.temp:CreateEmployeeDto
// TODO : validation on rows
