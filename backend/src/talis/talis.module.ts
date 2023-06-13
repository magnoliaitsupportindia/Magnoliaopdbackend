import { Module } from '@nestjs/common';
import { TalisService } from './talis.service';
import { TalisController } from './talis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { masterReportTail, moduleTable, screens, subModule } from './entities/tali.entity';

@Module({
  controllers: [TalisController],
  imports: [TypeOrmModule.forFeature([moduleTable, subModule, screens,masterReportTail])],
  providers: [TalisService],
})
export class TalisModule {}
