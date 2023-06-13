import { Test, TestingModule } from '@nestjs/testing';
import { DrugMasterController } from './drug_master.controller';
import { DrugMasterService } from './drug_master.service';

describe('DrugMasterController', () => {
  let controller: DrugMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrugMasterController],
      providers: [DrugMasterService],
    }).compile();

    controller = module.get<DrugMasterController>(DrugMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
