import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentMasterService } from './department-master.service';

describe('DepartmentMasterService', () => {
  let service: DepartmentMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentMasterService],
    }).compile();

    service = module.get<DepartmentMasterService>(DepartmentMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
