import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpStatus,
  Inject,
  forwardRef,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import express, { Request, Response } from 'express';
import {
  CreateUserManagementDto,
  loginDto,
} from './dto/create-user-management.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as XLSX from 'xlsx';
import { UpdateUserManagementDto } from './dto/update-user-management.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserManagement } from './entities/user-management.entity';
import { AuthGuard } from '@nestjs/passport';

const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};
@ApiTags('user')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('user')
export class UserManagementController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userManagementService: UserManagementService,
  ) {}

  @Post('addUser')
  async addUser(
    @Body() CreateUserManagementDto: CreateUserManagementDto,
    @Body() data: CreateUserManagementDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let company = req['user']['company'];
      let user = req['user']['id'];
      let userData = await this.userManagementService.addUser(data,company,user);
      if (userData) {
        this.logger.info(`successfully added user : addUser `);
        res.status(HttpStatus.OK).json({
          success: userData.status,
          message: userData.message,
        });
      } else {
        this.logger.warn('error in creating user : addUser');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in creating user :addUser', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating User',
      });
    }
  }

  @Get('signUpData')
  async signUpData(@Req() req: Request, @Res() res: Response) {
    try {
      let company = req['user']['company'];
      let getUser = await this.userManagementService.signUpData(company);
      this.logger.info(`successfully getting all signupData: user/signUpData `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Users onboarding details',
        data: getUser,
      });
    } catch (error) {
      this.logger.error(`error in getting signup data: user/signupData`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting User onbaording details',
      });
    }
  }

  @Get('adminSignUpData')
  async adminSignUpData(@Req() req: Request, @Res() res: Response) {
    try {
      // let company = req['user']['company'];
      let getUser = await this.userManagementService.adminSignUpData();
      this.logger.info(`successfully getting all signupData: user/signUpData `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting Users onboarding details',
        data: getUser,
      });
    } catch (error) {
      this.logger.error(`error in getting signup data: user/signupData`,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting User onbaording details',
      });
    }
  }

  @Get('getAllUser')
  async getAllUser(@Req() req: Request, @Res() res: Response) {
    try {
      let company = req['user']['company']
      let getUser = await this.userManagementService.getAllUser(company);
      this.logger.info(`successfully getting alluser :getAllUser `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Users',
        data: getUser,
      });
    } catch (error) {
      this.logger.error(`error in getting all users`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Users List',
      });
    }
  }

  @Get('getAllAdminUser')
  async getAllAdminUser(@Req() req: Request, @Res() res: Response) {
    try {
      let getUser = await this.userManagementService.getAllAdminUser();
      this.logger.info(`successfully getting alluser :getAllUser `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Users',
        data: getUser,
      });
    } catch (error) {
      this.logger.error(`error in getting all users`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Users List',
      });
    }
  }

  @Get('getUserById/:id')
  async getUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getByUSerId = await this.userManagementService.getUserById(id);
      this.logger.info(`successfully getting an user : getUserById/id -${id} `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting User detail',
        data: getByUSerId,
      });
    } catch (error) {
      this.logger.error(`error in getting an user : getUserById/id -${id} `,error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting User',
      });
    }
  }

  @Put('editUserDetails/:id')
  async edituserDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateUserManagementDto,
    @Param('id') id: number,
  ) {
    try {
      let editUserById = await this.userManagementService.editUserDetails(
        data,
        id,
      );
      this.logger.info(
        `successfully edit an user : editUserDetails/id -${id} `,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated User Details',
      });
    } catch (error) {
      this.logger.error(
        `error in edit an user : editUserDetails/id -${id} `,
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Update User Details',
      });
    }
  }

  @Delete('deleteUser/:id')
  async deleteUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let dltByUserId = await this.userManagementService.deleteUserById(id);
      this.logger.info(`successfully delete an user : deleteUser/id -${id} `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an User',
      });
    } catch (error) {
      this.logger.error(
        `successfully delete an user : getUserById/id -${id}`,
        error,
      );
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an User',
      });
    }
  }

  @Post('uploadUser')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/user/',
        filename: fileName,
      }),
    }),
  )
  async uploadUser(
    @UploadedFile() file,
    @Body()
    data: UserManagement,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let companyId = req['user']['company'];
      let roleDetials = {};
      let rolemanagement = await this.userManagementService.getAllRole(
        companyId,
      );
      rolemanagement.forEach((e) => {
        roleDetials[e['roleName'].toLowerCase()] = e['id'];
      });
      let files = XLSX.readFile(file.path);
      let sheetName = files.Props.SheetNames[0];
      const temp = XLSX.utils.sheet_to_json(files.Sheets[sheetName]);
      for (let i = 0; i < temp.length; i++) {
        if (
          typeof temp[i]['name'] == 'string' &&
          typeof temp[i]['address'] == 'string' &&
          typeof temp[i]['role'] == 'string' &&
          typeof temp[i]['mobile'] == 'number'
        ) {
          temp[i]['role'] = roleDetials[temp[i]['role'].toLowerCase()];
          temp[i]['company'] = companyId;
          temp[i]['password'] = await bcrypt.hash(temp[i]['password'], 10);
        } else {
          this.logger.warn(
            `user bulk upload execl sheet have error: uploadUser`,
          );
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Invalid users data Upload',
          });
        }
      }
      if (temp.length) {
        let uploadUser = await this.userManagementService.bulkUpload(temp);
        this.logger.info(`user bulk upload successfully: uploadUser`);
        res.status(HttpStatus.OK).json({
          success: 'Successfully Uploaded User list',
          message: uploadUser.message,
        });
      } else {
        this.logger.warn(`user bulk upload data error: uploadUser`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error('error in bulk upload : uploadUser', error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error in user Upload',
      });
    }
  }
}

// @Post('loginUser')
// async login(@Body() loginData: loginDto, @Res() res: Response) {
//   try {
//     let verfied = await this.userManagementService.login(loginData);
//     if (verfied.status) {
//     this.logger.info(`successfully user login : loginUser `);
//     res.status(HttpStatus.OK).json({
//         success: true,
//         message: verfied.message,
//         data:verfied.data
//       });
//     } else {
//     this.logger.warn(`invalid user login : loginUser `);
//       res.status(400).json({
//         success: false,
//         message: verfied.message,
//       });
//     }
//   } catch (error) {
//     this.logger.error('Invalid username or password :login ', error);
//     res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
//       success: false,
//       message: 'Invalid Username or Password',
//     });
//   }
// }

// let deptDetails={}
// let department=await this.userManagementService.getalldept();
// department.forEach(ele => {
//   deptDetails[ele['departmentName'].toLowerCase()]=ele['id']
// });
// let companyDetails={}
// let company= await this.userManagementService.getallcomp();
// company.forEach(element => {
//   companyDetails[element['companyName'].toLowerCase()]=element['id']
// });
