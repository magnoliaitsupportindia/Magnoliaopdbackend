import { Test, TestingModule } from '@nestjs/testing';
import { VendorMasterService } from './vendor-master.service';

describe('VendorMasterService', () => {
  let service: VendorMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorMasterService],
    }).compile();

    service = module.get<VendorMasterService>(VendorMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
