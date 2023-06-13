import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, forwardRef, HttpStatus, Res, Req, Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DrugMasterService } from './drug_master.service';
import express, { Request, Response } from 'express';
import { CreateDrugMasterDto } from './dto/create-drug_master.dto';
import { UpdateDrugMasterDto } from './dto/update-drug_master.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { use } from 'passport';

const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};
@ApiTags('drugmaster')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('drugmaster')
export class DrugMasterController {
  constructor(
  @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  private readonly drugMasterService: DrugMasterService) {}

  @Post('addNewDrug')
  async addDrug(
    @Body() data: CreateDrugMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let user = req['user']['id']
      let company =req['user']['company']
      let drug=data.drugName
      let check=await this.drugMasterService.check(drug,company);
      if (!check){
        let dataDrug = await this.drugMasterService.addDrug(data,user,company);
        if (dataDrug) {
          this.logger.info(`successfully added an drug: addNewDrug`);
          res.status(HttpStatus.OK).json({
            success: true,
            message: 'Drug Added successfully',
          });
        } else {
          this.logger.warn('error in drug creation: addNewDrug');
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'The drug Already exists',
          });
        };
      }
      else{
        this.logger.warn('the drug is alreay exists :addNewDrug');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The drug already Exists',
        });
      }
    } catch (error) {
      this.logger.error("error in creating drug", error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Drug',
      });
    }
  }

  @Get('getAllDrug')
  async getAllDrug(@Req() req: Request, @Res() res: Response) {
    try {
      let company=req['user']['company']
      let getdrug = await this.drugMasterService.getAllDrug(company);
      this.logger.info(`successfully getting all drugs : getAllDrug`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Drugss',
        data: getdrug
      });
    } catch (error) {
      this.logger.error(`error in getting all drugs : getAllDrug`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Drug',
      });
    }
  }


  @Get('getRequestDrug')
  async getRequestDrug(@Req() req: Request, @Res() res: Response) {
    try {
      let getRequestDrug = await this.drugMasterService.getRequestDrug();
      this.logger.info(`successfully getting all request drugs : getAllRequestDrug`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Request Drugs',
        data: getRequestDrug
      });
    } catch (error) {
      this.logger.error(`error in getting Request Drugs : getAllRequestDrug`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Drug',
      });
    }
  }

  @Get('getDrugById/:id')
  async getDrugById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getBydrugId = await this.drugMasterService.getDrugById(id);
      this.logger.info(`successfully getting an drug : getDrugById/id -${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Drug detail',
        data: getBydrugId,
      });
    } catch (error) {
      this.logger.error(`error in getting an drug : getDrugById/id -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Drug',
      });
    }
  }

  @Delete('deleteDrug/:id')
  async deleteDrug(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id']
      let dltdrugId = await this.drugMasterService.deleteDrug(id,user);
      this.logger.info(`successfully deleted an drug :deleteDrug/id- ${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an Drug',
      });
    } catch (error) {
      this.logger.error(`error in delete an drug :deleteDrug/id -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an Drug',
      });
    }
  }
  
  @Put('editDrugDetails/:id')
  async editDrugDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateDrugMasterDto,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id']
      let editdrugById = await this.drugMasterService.editDrugDetails(data,id,user);
      this.logger.info(`successfully edit an drug : editDrugDetails/id -${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Drug Details',
      });
    } catch (error) {
      this.logger.error(`error in edit an drug detai : editDrugDetails/id -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Update Drug Details',
      });
    }
  }


  @Post('uploadDrug')
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
    data: UpdateDrugMasterDto,
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
          typeof temp[i]['drugName'] == 'string'
        ) {
          temp[i]['companyId'] = companyId;
          temp[i]['createdBy'] = req['user']['id']
          } else {
          this.logger.warn(`drug bulk upload execl sheet have error: uploadDrug`);
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid Drug data Upload',
          });
        }
      }
      if (temp.length) {
        let uploadEmp = await this.drugMasterService.bulkUpload(temp);
        this.logger.info(`drug bulk upload successfully: uploadDrug`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'successfully uploaded drug details',
        });
      } else {
        this.logger.warn(`drug bulk upload data error: uploadDrug`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadDrug', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in Drug Upload',
      });
    }
  }
}
