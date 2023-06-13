import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as XLSX from 'xlsx';
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
  Res,
  Req,
  HttpStatus,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import express, { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DepartmentMasterService } from './department-master.service';
import { CreateDepartmentMasterDto } from './dto/create-department-master.dto';
import { UpdateDepartmentMasterDto } from './dto/update-department-master.dto';
import { diskStorage } from 'multer';

const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};
@ApiTags('department')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('department')
export class DepartmentMasterController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly departmentMasterService: DepartmentMasterService,
  ) { }

  @Post('addNewDepartment')
  async addDepartment(
    @Body() data: CreateDepartmentMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let user = req['user']['id'];
      let company = req['user']['company'];
      let deptCheck = await this.departmentMasterService.check(data, company);
      if (!deptCheck) {
        let dataDept = await this.departmentMasterService.addDepartment(
          data,
          user,
          company,
        );
        if (dataDept) {
          this.logger.info('succesfullly added department : addNewDepartment');
          res.status(HttpStatus.OK).json({
            success: true,
            message: 'Department created successfully',
          });
        } else {
          this.logger.warn('Error in creating department:addNewDepartment');
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'something went wrong',
          });
        }
      } else {
        this.logger.warn('the department already exist:addNewDepartment');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The Department is Alreay Exist',
        });
      }
    } catch (error) {
      this.logger.error(
        'Error in creating department : addNewDepartment',
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Department',
      });
    }
  }

  @Get('getAllDepartment')
  async getAllDepartment(@Req() req: Request, @Res() res: Response) {
    try {
      let companyId = req['user']['company'];
      let getDept = await this.departmentMasterService.getAllDepartment(
        companyId,
      );
      this.logger.info(
        `successfully getting all department : getAllDepartment`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Getting All Departments',
        data: getDept,
      });
    } catch (error) {
      this.logger.error(`error getting department : getAllDepartment`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Departments',
      });
    }
  }

  @Get('getDepartmentById/:id')
  async getDepartmentById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getByDeptId = await this.departmentMasterService.getDepartmentById(
        id,
      );
      this.logger.info(
        `successfully getting department detail : getDepartmentById/id-${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Department detail',
        data: getByDeptId,
      });
    } catch (error) {
      this.logger.error(
        `error in getting department detail : getDepartmentById/id-${id}`, error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Department detail',
      });
    }
  }
  @Delete('deleteDepartment/:id')
  async deleteDepartment(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      // let companyId=req['user']['company']
      let dltByEmpId = await this.departmentMasterService.deleteDepartment(
        id,
        user,
      );
      this.logger.info(
        `successfully deleting an department :deleteDepartment/id-${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an Department',
      });
    } catch (error) {
      this.logger.error(
        `error in deleting department : deleteDepartment/id-${id}`, error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an Department',
      });
    }
  }
  @Put('editDepartmentById/:id')
  async editDepartmentById(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateDepartmentMasterDto,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      let editdeptById = await this.departmentMasterService.editDepartmentById(
        data,
        id,
        user,
      );
      this.logger.info(
        `suucessfully edit an deaprtment details : editDepartmentById/id-${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Department Details',
      });
    } catch (error) {
      this.logger.error(
        `error in editing department details : editDepartmentById/id -${id}`, error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Edit Department Details',
      });
    }
  }

  @Post('uploadDepartment')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/user/',
        filename: fileName,
      }),
    }),
  )
  async uploadEmp(
    @UploadedFile() file,
    @Body()
    data: UpdateDepartmentMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let companyId = req['user']['company'];
      let files = XLSX.readFile(file.path);
      let sheetName = files.Props.SheetNames[0];
      const temp = XLSX.utils.sheet_to_json(files.Sheets[sheetName]);
      for (let i = 0; i < temp.length; i++) {
        if (typeof temp[i]['departmentName'] == 'string') {
          temp[i]['companyId'] = companyId;
          temp[i]['createdBy'] = req['user']['id']
        } else {
          this.logger.warn(
            `department bulk upload execl sheet have error: uploadDepartment`,
          );
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid Department data Upload',
          });
        }
      }
      if (temp.length) {
        let uploadEmp = await this.departmentMasterService.bulkUpload(temp);
        if (uploadEmp.length) {
          this.logger.info(`department bulk upload successfully: uploadDepartment`);
          res.status(HttpStatus.OK).json({
            success: true,
            message: 'successfully uploaded department details',
          });
        } else {
          this.logger.warn(`department bulk upload data error: uploadDepartment`);
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Error in Deparment data Upload',
          });
        }
      } else {
        this.logger.warn(`department bulk upload data error: uploadDepartment`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadDepartment', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in Department Upload',
      });
    }
  }
}
