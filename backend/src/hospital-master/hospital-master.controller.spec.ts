import { Test, TestingModule } from '@nestjs/testing';
import { HospitalMasterController } from './hospital-master.controller';
import { HospitalMasterService } from './hospital-master.service';

describe('HospitalMasterController', () => {
  let controller: HospitalMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalMasterController],
      providers: [HospitalMasterService],
    }).compile();

    controller = module.get<HospitalMasterController>(HospitalMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
