import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
  Res,
  HttpStatus,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import express, { Request, Response } from 'express';
// import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { VendorMasterService } from './vendor-master.service';
import { CreateVendorMasterDto } from './dto/create-vendor-master.dto';
import { UpdateVendorMasterDto } from './dto/update-vendor-master.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as XLSX from 'xlsx';

const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};
@ApiTags('vendor')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('vendor')
export class VendorMasterController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly vendorMasterService: VendorMasterService,
  ) { }
  @Post('addNewVendor')
  async addVendor(
    @Body() data: CreateVendorMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let company = req['user']['company'];
      let user = req['user']['id'];
      let checkVendor = await this.vendorMasterService.check(data, company);
      if (!checkVendor) {
        let vendor = await this.vendorMasterService.addVendor(
          data,
          company,
          user,
        );
        if (vendor) {
          this.logger.info(`successfully added contractor :addNewVendor`);
          res.status(HttpStatus.OK).json({
            success: true,
            message: 'Contractor created successfully',
          });
        } else {
          this.logger.warn('error in creating contractor :addNewVendor');
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'something went wrong',
          });
        }
      } else {
        this.logger.warn('the contractor already exist :addNewVendor');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The Contractor Already Exists',
        });
      }
    } catch (error) {
      this.logger.error('error in creating contractor :addNewVendor', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Contractor',
      });
    }
  }

  @Get('getAllvendor')
  async getAllvendor(@Req() req: Request, @Res() res: Response) {
    let role = req['user']['role']
    if (role == 1 || role == 2 || role == 3) {
      try {
        let company = req['user']['company'];
        let getvendor = await this.vendorMasterService.getAllVendor(company);
        this.logger.info(`successfully getting all contractors :getAllVendor`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'Successfully getting All Contractors',
          data: getvendor,
        });
      } catch (error) {
        this.logger.error(`error in getting all contractors :getAllVendor`, error);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Error In Getting Contractors',
        });
      }
    } else{
      this.logger.warning(`Invalid user try access this API :getAllVendor - user -${req['user']['id']}`);
      // res.status(HttpStatus.FORBIDDEN).json({
      //   success: false,
      //   message: 'You have no Access to Get this Details',
      // });
    }
  }

  @Get('getvendorById/:id')
  async getvendorById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getByVendId = await this.vendorMasterService.getVendorById(id);
      this.logger.info(
        `successfully getting an contractor:getVendorById/id -${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Contractor detail',
        data: getByVendId,
      });
    } catch (error) {
      this.logger.error(
        `error in getting an contractor :getVendorById -${id} `, error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Contractor',
      });
    }
  }

  @Delete('deletevendor/:id')
  async deletevendor(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      let dltByvendorId = await this.vendorMasterService.deleteVendor(id, user);
      this.logger.info(
        `successfully delete an contractor : deleteVendor/id -${id} `,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an Contractor',
      });
    } catch (error) {
      this.logger.error(
        `error in delete an contractor : deleteVendor/id-${id} `, error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an Contractor',
      });
    }
  }

  @Put('editvendorDetails/:id')
  async editvendorDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateVendorMasterDto,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      let editVendorById = await this.vendorMasterService.editVendor(
        data,
        id,
        user,
      );
      this.logger.info(
        `successfully edit an contractor: editVendorDetails/id-${id} `,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Contractor Details',
      });
    } catch (error) {
      this.logger.error(
        `error in edit an contractor : editVendorDetails/id -${id} `, error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Edit Contractor Details',
      });
    }
  }

  @Post('uploadVendor')
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
    data: UpdateVendorMasterDto,
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
          typeof temp[i]['vendorName'] == 'string' &&
          typeof temp[i]['purposeOfVendor'] == 'string'
        ) {
          temp[i]['companyId'] = companyId;
          temp[i]['createdBy'] = req['user']['id']
        } else {
          this.logger.warn(
            `contractor bulk upload execl sheet have error: uploadVendor`,
          );
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid Contractor data Upload',
          });
        }
      }
      if (temp.length) {
        let uploadEmp = await this.vendorMasterService.bulkUpload(temp);
        this.logger.info(`contractor bulk upload successfully: uploadVendor`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'successfully uploaded contractor details',
        });
      } else {
        this.logger.warn(`contractor bulk upload data error: uploadVendor`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadVendor', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in Contractor Upload',
      });
    }
  }
}
