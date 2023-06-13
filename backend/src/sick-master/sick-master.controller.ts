import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import express, { Request, Response } from 'express';
import { UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
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
} from '@nestjs/common';
import { SickMasterService } from './sick-master.service';
import { CreateSickMasterDto } from './dto/create-sick-master.dto';
import { UpdateSickMasterDto } from './dto/update-sick-master.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};
@ApiTags('sickmaster')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('sickmaster')
export class SickMasterController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly sickMasterService: SickMasterService,
  ) {}
  @Post('addNewSick')
  async addSick(  
    @Body() data: CreateSickMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let user=req['user']['id']
      let company=req['user']['company']
      let sick= await this.sickMasterService.check(data,company);
      if(!sick){
        let dataSick = await this.sickMasterService.addSick(data,user,company);
        if (dataSick) {
          this.logger.info(`succesfully sick added : addNewSick `);
          res.status(HttpStatus.OK).json({
            success: true,
            message: 'Sick created successfully',
          });
        } else {
          this.logger.warn('error in Sick creation :addNewSick');
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'something went wrong',
          });
        }
      }else{
        this.logger.warn('the sick already exists:addNewSick');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The sick Already Exists',
        });
      }
    } catch (error) {
      this.logger.error("error in creating sick :addNewSick", error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Sick',
      });
    }
  }

  @Get('getAllSick')
  async getAllSick(@Req() req: Request, @Res() res: Response) {
    try {
      let company=req['user']['company']
      let getSick = await this.sickMasterService.getAllSick(company);
      this.logger.info(`succesfully getting all sick: getAllSick `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Sicks',
        data: getSick,
      });
    } catch (error) {
      this.logger.error(`error in getting all sick : getAllSick `,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Sick',
      });
    }
  }

  @Get('getSickById/:id')
  async getSickById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getBySickId = await this.sickMasterService.getSickById(id);
      this.logger.info(`succesfully getting an sick  : getSickById/id -${id} `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Sick detail',
        data: getBySickId,
      });
    } catch (error) {
      this.logger.error(`error in getting an sick : getSickById/id -${id} `,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Sick',
      });
    }
  }

  @Delete('deleteSick/:id')
  async deleteSick(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let user=req['user']['id']
      let dltBySickId = await this.sickMasterService.deleteSick(id,user);
      this.logger.info(`succesfully delete an sick :deleteSick/id -${id} `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an Sick',
      });
    } catch (error) {
      this.logger.error(`error in delete an sick :deleteSick/id -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an Sick',
      });
    }
  }

  @Put('editSickDetails/:id')
  async editSickDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: UpdateSickMasterDto,
    @Param('id') id: number,
  ) {
    try {
      let user=req['user']['id']
      let editSickById = await this.sickMasterService.editSickDetails(data,id,user);
      this.logger.info(`Successfuly edit an sick : editSickDetails/id -${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Sick Details',
      });
    } catch (error) {
      this.logger.error(`error in edit an sick :editSickDetails/id -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Edit Sick Details',
      });
    }
  }

  @Post('uploadSick')
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
    data:UpdateSickMasterDto,
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
          typeof temp[i]['sickName'] == 'string'
        ) {
          temp[i]['companyId'] = companyId;
          temp[i]['createdBy'] = req['user']['id']
          } else {
          this.logger.warn(`sick bulk upload execl sheet have error: uploadSick`);
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid sick data Upload',
          });
        }
      }
      if (temp.length) {
        let uploadEmp = await this.sickMasterService.bulkUpload(temp);
        this.logger.info(`sick bulk upload successfully: uploadSick`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'successfully uploaded sick details',
        });
      } else {
        this.logger.warn(`sick bulk upload data error: uploadSick`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadSick', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in sick Upload',
      });
    }
  }
}
