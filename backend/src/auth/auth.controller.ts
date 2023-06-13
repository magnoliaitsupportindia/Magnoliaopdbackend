import { Controller, Get, Post, Body, Param, Res, Inject, HttpStatus} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Response } from 'express';
import { AuthService } from './auth.service'
import { LoginDto } from './dto/user-dto'

import {default as config} from '../config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, 
private authService: AuthService) {}


@Post('loginUser')
async login(@Body() loginData: LoginDto, @Res() res: Response) {
  try {
    let verfied = await this.authService.login(loginData);
    if (verfied.status) {
    this.logger.info(`successfully user login : loginUser `);
    res.status(HttpStatus.OK).json({
        success: verfied.status,
        message: verfied.message,
        data:verfied.data
      });
    } else {
    this.logger.warn(`invalid user login : loginUser `);
      res.status(HttpStatus.BAD_REQUEST).json({
        success: verfied.status,
        message: verfied.message,
      });
    }
  } catch (error) {
    this.logger.error('Invalid username or password :login ', error);
    res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Invalid Username or Password',
    });
  }
}

}
