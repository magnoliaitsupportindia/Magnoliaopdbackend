import { Test, TestingModule } from '@nestjs/testing';
import { HospitalMasterService } from './hospital-master.service';

describe('HospitalMasterService', () => {
  let service: HospitalMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalMasterService],
    }).compile();

    service = module.get<HospitalMasterService>(HospitalMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
