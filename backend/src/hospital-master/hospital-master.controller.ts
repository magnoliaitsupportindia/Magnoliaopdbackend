import express, { Request, Response } from 'express';
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
  Put,
  HttpStatus,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { HospitalMasterService } from './hospital-master.service';
import { CreateHospitalMasterDto } from './dto/create-hospital-master.dto';
import { UpdateHospitalMasterDto } from './dto/update-hospital-master.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';

const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};

@ApiTags('hospitalmaster')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('hospitalmaster')
export class HospitalMasterController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly hospitalMasterService: HospitalMasterService,
  ) {}
  @Post('addNewHospital')
  async addHospital(
    @Body() data: CreateHospitalMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let user = req['user']['id'];
      let company = req['user']['company'];
      let check = await this.hospitalMasterService.check(data, company);
      if (!check) {
        let dataHospital = await this.hospitalMasterService.addHospital(
          data,
          user,
          company,
        );
        if (dataHospital) {
          this.logger.info(`successfully added an hospital : addNewHospital`);
          res.status(HttpStatus.OK).json({
            success: true,
            message: 'Hospital created successfully',
          });
        } else {
          this.logger.warn('error in hospital creation :addNewHospital');
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'something went wrong',
          });
        }
      } else {
        this.logger.warn('the hospital already exists :addNewHospital');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The Hospital is Alreay Exists',
        });
      }
    } catch (error) {
      this.logger.error('error in creating hospital :addNewHospital -', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Hospital',
      });
    }
  }

  @Get('getAllHospital')
  async getAllHospital(@Req() req: Request, @Res() res: Response) {
    try {
      let company = req['user']['company'];
      let getHospital = await this.hospitalMasterService.getAllHospital(
        company,
      );
      this.logger.info(`successfully getting all hospital : getAllHospital`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Hospitals : getAllHospital',
        data: getHospital,
      });
    } catch (error) {
      this.logger.error(`error in getting all hospital :getAllHospital`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Hospital',
      });
    }
  }

  @Get('getHospitalById/:id')
  async getHospitalById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getByhosId = await this.hospitalMasterService.getHospitalById(id);
      this.logger.info(`successfully getting hospital:getHosptalById/id-${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Hospital detail',
        data: getByhosId,
      });
    } catch (error) {
      this.logger.error(
        `error in getting hospital details : getHospitalById/id -${id}`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Hospital',
      });
    }
  }

  @Delete('deleteHospital/:id')
  async deleteHospital(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      let dltByhosId = await this.hospitalMasterService.deleteHospital(
        id,
        user,
      );
      this.logger.info(
        `successfully delete an hospital : deleteHospital/id- ${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an Hospital',
      });
    } catch (error) {
      this.logger.error(
        `error in deleting hospital : deleteHospital/id -${id}`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an Hospital',
      });
    }
  }

  @Put('editHospitalDetails/:id')
  async editHospitalDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateHospitalMasterDto,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      let edithosById = await this.hospitalMasterService.editHospitalDetails(
        data,
        id,
        user,
      );
      this.logger.info(
        `successfully edit an hospital details : editHospitalDetials/id -${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Hospital Details',
      });
    } catch (error) {
      this.logger.error(
        `error in edit hospital details : editHospitalDetails/id -${id}`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Edit Hospital Details',
      });
    }
  }

  @Get('getHospitalByDate/:date')
  async getHospitalByDate(
    @Req() req: Request,
    @Res() res: Response,
    @Param('date') date: Date,
  ) {
    try {
      let company = req['user']['company'];
      let getByhosId = await this.hospitalMasterService.getHospitalByDate(
        date,
        company,
      );
      this.logger.info(
        `successfully getting hospital:getHosptalBydate/date-${date}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Hospital detail By Date',
        data: getByhosId,
      });
    } catch (error) {
      this.logger.error(
        `error in getting hospital details : getHospitalByDate/date -${date}`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Hospital By Date',
      });
    }
  }

  @Post('getAllHospitalWithLazyLoading')
  async getAllHospitalWithLazyLoading(@Req() req: Request, @Res() res: Response,@Body() details) {
    try {
      let getHospital = await this.hospitalMasterService.getAllHospitalWithLazyLoading(details);
      this.logger.info(`successfully getting all hospital : getAllHospitalWithLazyLoading `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Hospitals : getAllHospitalWithLazyLoading',
        data: getHospital,
      });
    } catch (error) {
      this.logger.error(`error in getting all hospital :getAllHospitalWithLazyLoading`);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Hospital',
      });
    }
  }

  @Post('uploadHospital')
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
    data: UpdateHospitalMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let companyId = req['user']['company'];
      let files = XLSX.readFile(file.path);
      let sheetName = files.Props.SheetNames[0];
      const temp = XLSX.utils.sheet_to_json(files.Sheets[sheetName]);
      for (let i = 0; i < temp.length; i++) {
        if (typeof temp[i]['hospitalName'] == 'string') {
          temp[i]['companyId'] = companyId;
          temp[i]['createdBy'] = req['user']['id']
        } else {
          this.logger.warn(
            `hospital bulk upload execl sheet have error: uploadHospital`,
          );
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid hospital data Upload',
          });
        }
      }
      if (temp.length) {
        let uploadEmp = await this.hospitalMasterService.bulkUpload(temp);
        this.logger.info(`hospital bulk upload successfully: uploadHospital`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'successfully uploaded hospital details',
        });
      } else {
        this.logger.warn(`hospital bulk upload data error: uploadHospital`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadHospital', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in hospital Upload',
      });
    }
  }
}
