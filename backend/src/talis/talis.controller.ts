import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TalisService } from './talis.service';
import { CreateTaliDto } from './dto/create-tali.dto';
import { UpdateTaliDto } from './dto/update-tali.dto';
import { Logger } from 'winston';
import express, { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('talis')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('talis')
export class TalisController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly talisService: TalisService,
  ) {}

  @Get('getallTails')
  async getAllSick(@Req() req: Request, @Res() res: Response) {
    let role = req['user']['role']
    if(role == 1){
      try {
        let gettails = await this.talisService.GetAllAdminTails();
        this.logger.info(`succesfully getting all tails:getallTails `);
        res.status(HttpStatus.OK).send(gettails)
      } catch (error) {
        this.logger.error(`error in getting all tails:getallTails`,error);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Error In Getting Dashboard Tails',
        });
      }
    }
    if (role == 2 || role == 3) {
      try {
        let gettails = await this.talisService.GetAllTails();
        this.logger.info(`succesfully getting all tails:getallTails `);
        res.status(HttpStatus.OK).send(gettails)
      } catch (error) {
        this.logger.error(`error in getting all tails:getallTails`,error);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Error In Getting Dashboard Tails',
        });
      }
    }else{
      this.logger.warning(`Invalid User try to access:getallTails - user -${req['user']['id']}`);
    }
  }


  @Get('getMasterTails')
  async GetMasterTails(@Req() req: Request, @Res() res: Response) {
    let role = req['user']['role']
    if (role == 1 || role == 2 || role == 3) {
      try {
        let gettails = await this.talisService.GetMasterTails();
        this.logger.info(`succesfully getting all Master tails:getallTails `);
        res.status(HttpStatus.OK).send(gettails)
      } catch (error) {
        this.logger.error(`error in getting all tails:getallTails`,error);
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          message: 'Error In Getting Master Tails',
        });
      }
    }else{
      this.logger.warning(`Invalid User try to access:getMasterTails - user -${req['user']['id']}`);
    }
  }
  // @Get('getallTails')
  // GetAllTails() {
  //   this.logger.info(`succesfully getting all tails:getallTails `);
  //   return this.talisService.GetAllTails();
  // }

  // @Get('getMasterTails')
  // GetMasterTails() {
  //   this.logger.info(`succesfully getting all tails : getMasterTails `);
  //   return this.talisService.GetMasterTails();
  // }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.talisService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaliDto: UpdateTaliDto) {
  //   return this.talisService.update(+id, updateTaliDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.talisService.remove(+id);
  // }
}
