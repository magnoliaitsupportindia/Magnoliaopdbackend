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
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import express, { Request, Response } from 'express';
import { RolemanagementService } from './rolemanagement.service';
import { CreateRolemanagementDto } from './dto/create-rolemanagement.dto';
import { UpdateRolemanagementDto } from './dto/update-rolemanagement.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};
@ApiTags('rolemanagement')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('rolemanagement')
export class RolemanagementController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly rolemanagementService: RolemanagementService,
  ) {}
  @Post('addNewRole')
  async addRole(
    @Body() data: CreateRolemanagementDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let signData={'createdBy':req['user']['id'],'company':req['user']['company']}
      let check= await this.rolemanagementService.check(data,signData)
      if(!check){
        let dataRole = await this.rolemanagementService.addRole(data,signData);
        if (dataRole) {
          this.logger.info(`succesfully role added : addNewRole `);
          res.status(HttpStatus.OK).json({
            success: true,
            message: 'Role created successfully',
          });
        } else {
          this.logger.warn('error in Role creation :addNewRole');
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'something went wrong',
          });
        }
      }else{
        this.logger.warn('The role already exist :addNewRole');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'The role already exists',
        });
      }
    } catch (error) {
      this.logger.error("error in creating role :addNewRole", error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Role',
      });
    }
  }

  @Get('getAllRole')
  async getAllRole(@Req() req: Request, @Res() res: Response) {
    try {
      let companyDetail=req['user']['company']
      let getRole = await this.rolemanagementService.getAllRole(companyDetail);
      this.logger.info(`succesfully getting all role : getAllRole `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Roles',
        data: getRole,
      });
    } catch (error) {
      this.logger.error(`error in getting all role: get all role `,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Role',
      });
    }
  }

  @Get('getRoleById/:id')
  async getRoleById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      // let companyDetail=req['user']['company']
      let getByRoleId = await this.rolemanagementService.getRoleById(id);
      this.logger.info(`succesfully gettin an role : getRoleById-${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Role detail',
        data: getByRoleId,
      });
    } catch (error) {
      this.logger.error(`error in getting an role: getRoleById -${id} `,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Role',
      });
    }
  }

  @Delete('deleteRole/:id')
  async deleteRole( 
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let signData={'deletedBy':req['user']['id']}
      let dltByRoleId = await this.rolemanagementService.deleteRole(id,signData);
      this.logger.info(`succesfully deleted an role : deleteRole/id -${id} `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an Role',
      });
    } catch (error) {
      this.logger.error(`error in deleting an role :deleteRole/id -${id} `,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an Role',
      });
    }
  }

  @Put('editRoleDetails/:id')
  async editRoleDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateRolemanagementDto,
    @Param('id') id: number,
  ) {
    try {
      let detail=req['user']['id']
      let editRoleById = await this.rolemanagementService.editRoleDetails(data,id,detail);
      this.logger.info(`succesfully edit an role : editRoleDetails/id -${id} `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Role Details',
      });
    } catch (error) {
      this.logger.info(`error in edit an role : editRoleDetails/id -${id}`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Edit Role Details',
      });
    }
  }

  @Post('uploadRole')
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
    data: UpdateRolemanagementDto,
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
          typeof temp[i]['roleName'] == 'string'
        ) {
          temp[i]['companyId'] = companyId;
          } else {
          this.logger.warn(`role bulk upload execl sheet have error: uploadRole`);
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid Role data Upload',
          });
        }
      }
      if (temp.length) {
        let uploadEmp = await this.rolemanagementService.bulkUpload(temp);
        this.logger.info(`role bulk upload successfully: uploadRole`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'successfully uploaded role details',
        });
      } else {
        this.logger.warn(`role bulk upload data error: uploadRole`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadRole', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in role Upload',
      });
    }
  }
}
