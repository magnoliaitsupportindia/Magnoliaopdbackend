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
  Put,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCityDto, CreateCompanyDto, CreateCompanyEmployeeTypeDto, CreateIndustryTypeDto, CreateStateDto, docFileFilter } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import * as path from 'path';


const fileName = (req, file, cb) => {
  let ext = Date.now() + path.extname(file.originalname);
  cb(null, ext);
};

@ApiTags('company')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('company')
export class CompanyController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly companyService: CompanyService,
  ) {}

  @Get('signUpData')
  async signUpData(@Req() req: Request, @Res() res: Response) {
    try {
      let getCompany = await this.companyService.signUpData();
      this.logger.info(`successfully getting company added list : signUpData`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Companys',
        data: getCompany,
      });
    } catch (error) {
      this.logger.error(`error in getting company added list : signUpData`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Signup data',
      });
    }
  }

  @Post('addNewCompany')
  @UseInterceptors(
    FileInterceptor("file", { fileFilter: docFileFilter })
    // FileInterceptor('file', {
    //   storage: diskStorage({
    //     destination: 'uploads/user/',
    //     filename: fileName,
    //   }),
    // }),
  )
  async addCompany(
    @UploadedFile() file:Express.Multer.File,
    @Body() data:CreateCompanyDto, 
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let createData =  JSON.parse(JSON.stringify(data))
      // if (file) { 
      //   createData['companyLogoPath'] = file['path'];
      // }
      let signData = { 'createdBy': req['user']['id'] }
      let dataCompany = await this.companyService.addCompany(createData,signData,file);
      if (dataCompany.status) {
        this.logger.info(`add new company in master:addNewCompany ${data.companyName}`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'Company created successfully',
        });
      } else {
        this.logger.warn('Error in Company creation:addNewCompany');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error("Error in creating company", error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Company',
      });
    }
  }

  @Get('getAllCompany')
  async getAllCompany(@Req() req: Request, @Res() res: Response) {
    try {
      let user = req['user']['id']
      let getCompany = await this.companyService.getAllCompany(user);
      this.logger.info(`successfully getting all company list : getAllCompany`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully getting All Companys',
        data: getCompany,
      });
    } catch (error) {
      this.logger.error(`error in getting all company list : getAllCompany`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Company',
      });
    }
  }

  @Get('getCompanyById/:id')
  async getCompanyById(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getByCompanyId = await this.companyService.getCompanyById(id);
      this.logger.info(`getting company by id : getCompanyById/id-${id} `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'successfully getting Company detail',
        data: getByCompanyId,
      });
    } catch (error) {
      this.logger.error(`error in getting company details:getCompanyById/id-${id}`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting Company',
      });
    }
  }

  @Delete('deleteCompany/:id')
  async deleteCompany(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id']
      let dltCompanyId = await this.companyService.deleteCompany(id, user);
      this.logger.info(`successfully delete an company : deleteCompany/id -${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully removed an Company',
      });
    } catch (error) {
      this.logger.error(`error in deleting company details: deleteCompany/id -${id}`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In remove an Company',
      });
    }
  }

  @Put('editCompanyDetails/:id')
  async editCompanyDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: CreateCompanyDto,
    @Param('id') id: number,
  ) {
    try {
      let user = req['user']['id']
      let editCompanyById = await this.companyService.editCompanyDetails(data, id, user);
      this.logger.info(`succesfully edit an company details:editCompanyDetails/id-${id}`);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Successfully Updated Company Details',
      });
    } catch (error) {
      this.logger.error(`error in editing company details: editCompanyDetails/id-${id}`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Edit Company Details',
      });
    }
  }

  // employee type addding part 

  @Post('addNewEmployeeType')
  async addEmployeeType(
    @Body() data: CreateCompanyEmployeeTypeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let user = req['user']['id']
      let company = req['user']['company']
      let loadData = {
        employeeType: data.employeeType,
        companyId: company,
        createdBy: user
      }
      let dataCompany = await this.companyService.addEmployeeType(loadData);
      if (dataCompany) {
        this.logger.info(`add new employee type company in master:addNewEmployeeType ${data.employeeType}`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'NewEmployeeType created successfully',
        });
      } else {
        this.logger.warn('Error in add new employee in Company:addNewEmployeeType');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error("Error in creating employee type", error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating NewEmployeeType',
      });
    }
  }

  // state added part 
  @Post('addNewState')
  async addState(
    @Body() data: CreateStateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let signData = req['user']['id']
      let stateAdd = {
        state: data.state,
        createdBy: signData
      }
      let dataCompany = await this.companyService.addState(stateAdd);
      if (dataCompany) {
        this.logger.info(`add new state in master:addNewState ${data.state}`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'State created successfully',
        });
      } else {
        this.logger.warn('Error in State creation:addNewState');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error("Error in creating company", error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating State',
      });
    }
  }

  //city added part 
  @Post('addNewCity')
  async addCity(
    @Body() data: CreateCityDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let signData = req['user']['id']
      let cityAdd = {
        city: data.city,
        state: data.state,
        createdBy: signData
      }
      let dataCompany = await this.companyService.addCity(cityAdd);
      if (dataCompany) {
        this.logger.info(`add new City in master:addNewCity ${data.city}`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'City created successfully',
        });
      } else {
        this.logger.warn('Error in City creation:addNewCity');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error("Error in creating city", error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating City',
      });
    }
  }

  // Industry type added part 
  @Post('addIndustryType')
  async addIndustryType(
    @Body() data: CreateIndustryTypeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let signData = req['user']['id']
      let entAdd = {
        enterpriseType:data.enterpriseType,
        createdBy: signData
      }
      let dataCompany = await this.companyService.addenterpriseType(entAdd);
      if (dataCompany) {
        this.logger.info(`add new Enterprise type in master:addIndustryType ${data.enterpriseType}`);
        res.status(HttpStatus.OK).json({
          success: true,
          message: 'Enterprise type created successfully',
        });
      } else {
        this.logger.warn('Error in Enterprise type creation:addIndustryType');
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'something went wrong',
        });
      }
    } catch (error) {
      this.logger.error("Error in creating Enterprise type:addIndustryType", error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Creating Enterprise type',
      });
    }
  }

  @Get('getCityByState/:id')
  async getCityByState(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      let getBycityId = await this.companyService.getCityByState(id);
      this.logger.info(`getting city by id : getCityByState/id-${id} `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'successfully getting City detail',
        data: getBycityId,
      });
    } catch (error) {
      this.logger.error(`error in getting city details : getCityByState/id-${id}`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting city',
      });
    }
  }

  @Get('getCompanyLogo')
  async getCompanyLogo(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let company = req['user']['company']
    try {
      let getBycityId = await this.companyService.getCompanyLogo(company);
      this.logger.info(`getting CompanyLogo by id : getCompanyLogo/id-${company} `);
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'successfully getting getCompanyLogo',
        data: getBycityId,
      });
    } catch (error) {
      this.logger.error(`error in getting CompanyLogo details : getCompanyLogo/id-${company}`, error);
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Error In Getting CompanyLogo',
      });
    }
  }
}
