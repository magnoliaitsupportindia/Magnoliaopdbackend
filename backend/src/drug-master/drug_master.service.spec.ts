import { Test, TestingModule } from '@nestjs/testing';
import { DrugMasterService } from './drug_master.service';

describe('DrugMasterService', () => {
  let service: DrugMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrugMasterService],
    }).compile();

    service = module.get<DrugMasterService>(DrugMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
