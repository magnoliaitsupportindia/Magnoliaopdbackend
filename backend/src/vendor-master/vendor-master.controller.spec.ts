import { Test, TestingModule } from '@nestjs/testing';
import { VendorMasterController } from './vendor-master.controller';
import { VendorMasterService } from './vendor-master.service';

describe('VendorMasterController', () => {
  let controller: VendorMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendorMasterController],
      providers: [VendorMasterService],
    }).compile();

    controller = module.get<VendorMasterController>(VendorMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
