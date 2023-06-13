import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserManagement } from 'src/user-management/entities/user-management.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { default as config } from '../config'
import { JwtStrategyService } from './passport/jwt-strategy.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.jwt.secretOrKey,
      signOptions: { expiresIn: config.jwt.expiresIn }
    }),
    // TypeOrmModule.forFeature([Token])
    TypeOrmModule.forFeature([UserManagement])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategyService]
})
export class AuthModule {}
