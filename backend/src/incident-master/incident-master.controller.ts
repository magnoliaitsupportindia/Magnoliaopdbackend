import express, { Request, Response } from 'express';
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
  Put,
  HttpStatus,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IncidentMasterService } from './incident-master.service';
import { CreateIncidentMasterDto } from './dto/create-incident-master.dto';
import { UpdateIncidentMasterDto } from './dto/update-incident-master.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { check } from 'prettier';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';

const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};
@ApiTags('incidentmaster')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('incidentmaster')
export class IncidentMasterController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly incidentMasterService: IncidentMasterService,
  ) {}
  @Post('addNewIncident')
  async addIncident(
    @Body() data: CreateIncidentMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let user=req['user']['id']
      let company=req['user']['company']
      let incidentname=data.incidentName
      let check=await this.incidentMasterService.check(incidentname,company)
      if(!check){
        let dataIncident = await this.incidentMasterService.addIncident(data,user,company);
        if (dataIncident) {
        this.logger.info(`successfully added an incident : addNewIncident`);
        res.status(HttpStatus.OK).json({
            success: true,
            message: 'Incident created successfully',
          });
        } else {
          this.logger.warn('Error in Incident creation : addNewIncident');
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'something went wrong',
          });
        }
      }else{
        this.logger.warn('incident already exist : addNewIncident');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The Incident Already Exist',
        });
      }
    } catch (error) {
      this.logger.error("Error in creating incident : addNewIncident", error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Incident',
      });
    }
  }

  @Get('getAllIncident')
  async getAllIncident(@Req() req: Request, @Res() res: Response) {
    try {
      let company=req['user']['company']
      let getIncident = await this.incidentMasterService.getAllIncident(company);
      this.logger.info(`successfully getting all incident : getAllIncident`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Incidents',
        data: getIncident,
      });
    } catch (error) {
      this.logger.error(`error in getting all incident : getAllIncident`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Incident',
      });
    }
  }

  @Get('getIncidentById/:id')
  async getIncidentById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getByincId = await this.incidentMasterService.getIncidentById(id);
      this.logger.info(`successfully getting an incident : getIncidentById/id -${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Incident detail',
        data: getByincId,
      });
    } catch (error) {
      this.logger.error(`error in getting an incident : getIncidentById/id -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Incident',
      });
    }
  }

  @Delete('deleteIncident/:id')
  async deleteIncident(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id']
      let dltByincId = await this.incidentMasterService.deleteIncident(id,user);
      this.logger.info(`successfully deleted an incident : deleteIncident/id -${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an Incident',
      });
    } catch (error) {
      this.logger.error(`error in an incident : deleteIncident/id -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an Incident',
      });
    }
  }

  @Put('editIncidentDetails/:id')
  async editIncidentDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateIncidentMasterDto,
    @Param('id') id: number,
  ) {
    try {
      let user=req['user']['id']
      let editincById = await this.incidentMasterService.editIncidentDetails(data,id,user);
      this.logger.info(`successfully edit an incident : editIncidentDetails/id`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Incident Details',
      });
    } catch (error) {
      this.logger.error(`error in edit an incident : editIncidentDetails/id`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Edit Incident Details',
      });
    }
  }

  @Post('uploadIncident')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/user/',
        filename: fileName,
      }),
    }),
  )
  async uploadDrug(
    @UploadedFile() file,
    @Body()
    data: UpdateIncidentMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let companyId = req['user']['company'];
      let files = XLSX.readFile(file.path);
      let sheetName = files.Props.SheetNames[0];
      const temp = XLSX.utils.sheet_to_json(files.Sheets[sheetName]);
      for (let i = 0; i < temp.length; i++) {
        if (
          typeof temp[i]['incidentName'] == 'string'
        ) {
          temp[i]['companyId'] = companyId;
          temp[i]['createdBy'] = req['user']['id']
          } else {
          this.logger.warn(`incident bulk upload execl sheet have error: uploadIncident`);
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid Incident data Upload',
          });
        }
      }
      if (temp.length) {
        let uploadEmp = await this.incidentMasterService.bulkUpload(temp);
        this.logger.info(`incident bulk upload successfully: uploadIncident`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'successfully uploaded incident details',
        });
      } else {
        this.logger.warn(`incident bulk upload data error: uploadIncident`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadIncident', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in Incident Upload',
      });
    }
  }
}
