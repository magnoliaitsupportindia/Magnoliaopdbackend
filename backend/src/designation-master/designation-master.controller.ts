import express, { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as XLSX from 'xlsx';
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  forwardRef,
  Inject,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DesignationMasterService } from './designation-master.service';
import { CreateDesignationMasterDto } from './dto/create-designation-master.dto';
import { UpdateDesignationMasterDto } from './dto/update-designation-master.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';

const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};
@ApiTags('designationmaster')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('designationmaster')
export class DesignationMasterController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly designationMasterService: DesignationMasterService,
  ) {}
  @Post('addNewDesignation')
  async addDesignation(
    @Body() data: CreateDesignationMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let company = req['user']['company'];
      let user = req['user']['id'];
      let desc = await this.designationMasterService.check(data, company);
      if (!desc) {
        let dataDesignation =
          await this.designationMasterService.addDesignation(
            data,
            user,
            company,
          );
        if (dataDesignation) {
          this.logger.info(
            `successfully added an designation : addNewDesigantion`,
          );
          res.status(HttpStatus.OK).json({
            success: true,
            message: 'Designation created successfully',
          });
        } else {
          this.logger.warn('error in Designation creation : addNewDesignation');
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'something went wrong',
          });
        }
      } else {
        this.logger.warn('the designation already exists: addNewDesignation');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The Designation Already Exists',
        });
      }
    } catch (error) {
      this.logger.error(
        'error in creating designation : addNewDesignation',
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Designation',
      });
    }
  }

  @Get('getAllDesignation')
  async getAllDesignation(@Req() req: Request, @Res() res: Response) {
    try {
      let company = req['user']['company'];
      let getDesignation =
        await this.designationMasterService.getAllDesignation(company);
      this.logger.info(
        `successfully getting all designation : getAllDesignaiton`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Designations',
        data: getDesignation,
      });
    } catch (error) {
      this.logger.error(`error in getting designation : getAllDesignation`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting All Designation',
      });
    }
  }

  @Get('getDesignationById/:id')
  async getDesignationById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getBydesId = await this.designationMasterService.getDesignationById(
        id,
      );
      this.logger.info(
        `successfully get designation: getDesignationById/id-${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Designation detail',
        data: getBydesId,
      });
    } catch (error) {
      this.logger.error(
        `error in getting designation : getDesignationById/id -${id}`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Designation',
      });
    }
  }

  @Delete('deleteDesignation/:id')
  async deleteDesignation(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      let dltBydesId = await this.designationMasterService.deleteDesignation(
        id,
        user,
      );
      this.logger.info(
        `successfully deleded an designation : deleteDesignation/id-${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an Designation',
      });
    } catch (error) {
      this.logger.error(
        `error in deleted an designation : deleteDesigantion/id-${id}`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an Designation',
      });
    }
  }

  @Put('editDesignationDetails/:id')
  async editDesignationDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateDesignationMasterDto,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id'];
      let editdesById =
        await this.designationMasterService.editDesignationDetails(
          data,
          id,
          user,
        );
      this.logger.info(
        `successfully edit an designation : editDesignationDetails/id-${id}`,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Designation Details',
      });
    } catch (error) {
      this.logger.error(
        `error in edit an designation details : editDesigantion/id -${id}`,error
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Edit Designation Details',
      });
    }
  }

  @Post('uploadDesignation')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/user/',
        filename: fileName,
      }),
    }),
  )
  async uploadDes(
    @UploadedFile() file,
    @Body()
    data: UpdateDesignationMasterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let companyId = req['user']['company'];
      let files = XLSX.readFile(file.path);
      let sheetName = files.Props.SheetNames[0];
      const temp = XLSX.utils.sheet_to_json(files.Sheets[sheetName]);

      for (let i = 0; i < temp.length; i++) {
        if (typeof temp[i]['designationName'] == 'string') {
          temp[i]['companyId'] = companyId;
          temp[i]['createdBy'] = req['user']['id']
        } else {
          this.logger.warn(
            `designation bulk upload execl sheet have error: uploadDesignation`,
          );
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid Designation data Upload',
          });
        }
      }
      if (temp.length) {
        let uploadEmp = await this.designationMasterService.bulkUpload(temp);
        this.logger.info(
          `designation bulk upload successfully: uploadDesignation`,
        );
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'successfully uploaded designation details',
        });
      } else {
        this.logger.warn(
          `designation bulk upload data error: uploadDesignation`,
        );
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadDesignation', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in Designation Upload',
      });
    }
  }
}
