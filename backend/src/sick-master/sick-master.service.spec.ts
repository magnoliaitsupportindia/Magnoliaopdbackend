import { Test, TestingModule } from '@nestjs/testing';
import { SickMasterService } from './sick-master.service';

describe('SickMasterService', () => {
  let service: SickMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SickMasterService],
    }).compile();

    service = module.get<SickMasterService>(SickMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
