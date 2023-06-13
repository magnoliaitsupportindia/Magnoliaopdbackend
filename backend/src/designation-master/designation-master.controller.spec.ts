import { Test, TestingModule } from '@nestjs/testing';
import { DesignationMasterController } from './designation-master.controller';
import { DesignationMasterService } from './designation-master.service';

describe('DesignationMasterController', () => {
  let controller: DesignationMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignationMasterController],
      providers: [DesignationMasterService],
    }).compile();

    controller = module.get<DesignationMasterController>(DesignationMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
