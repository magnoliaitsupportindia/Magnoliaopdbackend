import { Test, TestingModule } from '@nestjs/testing';
import { IncidentMasterService } from './incident-master.service';

describe('IncidentMasterService', () => {
  let service: IncidentMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentMasterService],
    }).compile();

    service = module.get<IncidentMasterService>(IncidentMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
