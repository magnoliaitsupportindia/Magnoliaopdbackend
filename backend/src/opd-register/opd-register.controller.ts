import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  forwardRef,
  Req,
  Res,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OpdRegisterService } from './opd-register.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { CreateOpdRegisterDto ,visitorsDto} from './dto/create-opd-register.dto';
import { UpdateOpdRegisterDto } from './dto/update-opd-register.dto';
import express, { Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('opdregister')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('opdregister')
export class OpdRegisterController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly opdRegisterService: OpdRegisterService,
  ) {}

  @Post('register')
  async addOpd(
    @Body() data: CreateOpdRegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let company = req['user']['company'];
      let user = req['user']['id'];
      // opt details addding part
      let empData = {
        empId: data.empId,
        complaintsType:data.complaintsType != null ? data.complaintsType : null,
        care: data.care,
        createdBy: user,
        companyId: company,
        hospitalId:data.hospitalId != null ? data.hospitalId : null,
      };
      let dataOpd = await this.opdRegisterService.addOpd(empData);

      // drug add part
      let drugMap = [];
      data.drugId.forEach((e, i) => {
        drugMap.push({
          drugId: data.drugId[i]['drug'],
          count: data.drugId[i]['count'],
          opdId: dataOpd.id,
          companyId: company,
          createdBy: user,
        });
      });
      let dataDrug = await this.opdRegisterService.addDrugOpd(drugMap);

      // complaint add part
      let complaint = [];
      data.complaintsId.forEach((e, i) => {
        complaint.push({
          opdId: dataOpd.id,
          complaints: data.complaintsId[i],
          companyId: company,
          createdBy: user,
        });
      });
      let dataSick = await this.opdRegisterService.addSickOpd(complaint);
      if (dataOpd && dataDrug && dataSick) {
        this.logger.info(
          `opd patient added successfully :opdregister/register -${data.empId}`,
        );
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'OPD patient added successfully',
        });
      } else {
        this.logger.warn(
          `error in create opd patient :opdregister/register -${data.empId}`,
        );
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Error in creating OPD',
        });
      }
    } catch (error) {
      this.logger.error(
        `error in creating opd patients :opdregister/register -${data.empId}`,
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating OPD',
      });
    }
  }

  @Get('signupData')
  async signUpData(@Req() req: Request, @Res() res: Response) {
    try {
      let user = req['user']['id'];
      let company = req['user']['company'];
      let getUser = await this.opdRegisterService.signUpData(user, company);
      this.logger.info(
        `successfully getting all signup data : opdRegister/signUpData`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Opd onboarding details',
        data: getUser,
      });
    } catch (error) {
      this.logger.error(
        `error in getting all signup data : opdRegister/signUpData`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting All Opd onboarding detail List',
      });
    }
  }

  @Get('opdDetails/:date')
  async getallOpd(
    @Req() req: Request,
    @Res() res: Response,
    @Param('date') date: string,
  ) {
    try {
      let companyDetail = req['user']['company'];
      let getUser = await this.opdRegisterService.getallOpd(
        companyDetail,
        date,
      );
      this.logger.info(`successfully getting opd details : opdDetails `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Opd Details',
        data: getUser,
      });
    } catch (error) {
      console.error('Error', error);
      this.logger.error(
        `error in getting opd details : opdRegister/opdDetails`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Opd Details List',
      });
    }
  }

  @Get('opdDetailsByDate/:date')
  async getallOpdByDate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('date') date:string,
  ) {
    try {
      let arr=date.split(",")
      let start=arr[0]
      let end =arr[1]
      let companyDetail = req['user']['company'];
      let getUser = await this.opdRegisterService.getallOpdByDate(companyDetail,start,end);
      this.logger.info(`successfully getting opd details by date : opdDetails `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Opd Details by Date',
        data: getUser,
      });
    } catch (error) {
      console.error('Error', error);
      this.logger.error(`error in getting opd details : opdRegister/opdDetails`,error );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Opd Details List by Date',
      });
    }
  }

  @Get('getCountOfSick/:date')
  async getCountOfSick(
    @Req() req: Request,
    @Res() res: Response,
    @Param('date') date: string,
  ) {
    try {
      let company = req['user']['company'];

      let getCount = await this.opdRegisterService.getCountOfSick(
        company,
        date,
      );
      this.logger.info(
        `successfully getting all count of sick : opdRegister/getCountOfSick`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Opd Count list',
        data: getCount,
      });
    } catch (error) {
      this.logger.error(
        `error in getting count of sicks : opdRegister/getCountOfSick`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Opd Count List',
      });
    }
  }

  @Get('getCountOfSickByDate/:date')
  async getCountOfSickByDate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('date') date: string,
  ) {
    try {
      let arr=date.split(",")
      let start=arr[0]
      let end =arr[1]
      let company = req['user']['company'];
      let getCount = await this.opdRegisterService.getCountOfSickByDate(
        company,start,end
      );
      this.logger.info(
        `successfully getting all count of sick : opdRegister/getCountOfSick`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Opd Count list',
        data: getCount,
      });
    } catch (error) {
      this.logger.error(
        `error in getting count of sicks : opdRegister/getCountOfSick`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Opd Count List',
      });
    }
  }

  @Get('getOpdByid/:id')
  async getOpdById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getOpdById = await this.opdRegisterService.getOpdById(id);
      this.logger.info(
        `successfully getting opd details: opdRegister/getOpdByID/id -${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting opd detail',
        data: getOpdById,
      });
    } catch (error) {
      this.logger.error(`error in getting opd details: opdRegister/getOpdById -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting opd detail',
      });
    }
  }
  @Get('getOpdEmp/:id')
  async getOpdEmp(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    try {
      let company = req['user']['company'];
      let getOpdEmp = await this.opdRegisterService.getOpdEmp(id, company);
      if(getOpdEmp.length){
        this.logger.info(`successfully getting employee details by empId: opdRegister/getOpdEmp/id -${id}`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'Successfully getting employee detail',
          data: getOpdEmp,
        });
      }else{
        this.logger.error(`error getting employee details by empId: opdRegister/getOpdEmp/id -${id}`);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Invalid EmloyeeId Given',
        });
      }
    } catch (error) {
      this.logger.error(
        `error getting employee details by empId: opdRegister/getOpdEmp/id -${id}`,
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting employee details',
      });
    }
  }
  @Get('getVisitHistory/:id')
  async getVisitHistory(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let company = req['user']['company'];
      let getVisitHistory = await this.opdRegisterService.getVisitHistory(
        id,
        company,
      );
      this.logger.info(
        `successfully getting opd visiting history: opdRegister/getVistHistory/id -${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting employee detail',
        data: getVisitHistory,
      });
    } catch (error) {
      this.logger.error(`error in getting visiting history : opdRegister/getvisitHistory/id -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting employee details',
      });
    }
  }

  @Get('getEmpid/:id')
  async getEmpidById(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      let getCount = await this.opdRegisterService.getEmpidById(id);
      this.logger.info(
        `successfully getting employee id : opdRegister/getEmpId/id -${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Empid',
        data: getCount,
      });
    } catch (error) {
      this.logger.error(
        `error in getting employee id : opdRegister/getEmpId/id -${id}`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Empid',
      });
    }
  }

  @Get('patientAddData')
  async patientAddData(@Req() req: Request, @Res() res: Response) {
    try {
      let companyId = req['user']['company'];
      let getUser = await this.opdRegisterService.patientAddData(companyId);
      this.logger.info(
        `successfully getting sick and drug details: opdRegister/patientAddData`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Opd onboarding details',
        data: getUser,
      });
    } catch (error) {
      this.logger.error(
        `error in getting sick and drug details: opdRegister/patientAddData`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting All Opd onboarding detail List',
      });
    }
  }


  @Post('addOpdVisitors')
  async addOpdToVisitors(
    @Body() data: visitorsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let company = req['user']['company'];
      let user = req['user']['id'];
      let visitors= {
        visitorName:data.visitorName,
        contactNumber:data.contactNumber,
        department:data.department,
        contactPerson:data.contactPerson,
        companyId:company,
        createdBy:user
      }
      let addvisit=await this.opdRegisterService.addvisitor(visitors)
      // opt details addding part
      let empData = {
        care: data.care,
        complaintsType:data.complaintsType != null ? data.complaintsType : null,
        createdBy: user,
        companyId: company,
        visitorsId:addvisit.id,
        hospitalId:data.hospitalId != null ? data.hospitalId : null,

      };
      let dataOpd = await this.opdRegisterService.addOpd(empData);

      // drug add part
      let drugMap = [];
      data.drugId.forEach((e, i) => {
        drugMap.push({
          drugId: data.drugId[i]['drug'],
          count: data.drugId[i]['count'],
          opdId: dataOpd.id,
          companyId: company,
          createdBy: user,
        });
      });
      let dataDrug = await this.opdRegisterService.addDrugOpd(drugMap);

      // complaint add part
      let complaint = [];
      data.complaintsId.forEach((e, i) => {
        complaint.push({
          opdId: dataOpd.id,
          complaints: data.complaintsId[i],
          companyId: company,
          createdBy: user,
        });
      });
      let dataSick = await this.opdRegisterService.addSickOpd(complaint);
      if (dataOpd && dataDrug && dataSick) {
        this.logger.info(`opd patient added successfully :opdregister/addvisitor -${data.visitorName}`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'OPD patient added successfully',
        });
      } else {
        this.logger.warn(`error in create opd patient :opdregister/addvisitor -${data.visitorName}`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Error in Creation OPD for visitor',
        });
      }
    } catch (error) {
      this.logger.error(`error in creating opd patients :opdregister/addvisitor -${data.visitorName}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating OPD for visitor',
      });
    }
  }

  @Get('getvisitor/:date')
  async getvisitor(
    @Req() req: Request,
    @Param('date') date: string,
    @Res() res: Response,
  ) {
    try {
      let company=req['user']['company']
      let getCount = await this.opdRegisterService.visiter(date,company);
      this.logger.info(`successfully getting employee id : opdRegister/getvisitor/date -${date}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting visitor opd details',
        data: getCount,
      });
    } catch (error) {
      this.logger.error(`error in getting employee id : opdRegister/getvisitor/date -${date}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting visitor opd details',
      });
    }
  }


  @Get('getvisitorByDate/:date')
  async getvisitorByDate(
    @Req() req: Request,
    @Param('date') date: string,
    @Res() res: Response,
  ) {
    try {
      let company=req['user']['company']
      let getCount = await this.opdRegisterService.visiter(date,company);
      this.logger.info(`successfully getting employee id : opdRegister/getvisitorByDate/date -${date}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting visitor opd details By DateWise',
        data: getCount,
      });
    } catch (error) {
      this.logger.error(`error in getting employee id : opdRegister/getvisitorByDate/date -${date}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting visitor opd details By DateWise',
      });
    }
  }
}


// empId: 8,
// drugId: [ { drug: 13, count: 10 }, { drug: 12, count: 10 } ],
// complaintsId: [ 8, 4, 2, 9 ],
// care: 'serious Condition'