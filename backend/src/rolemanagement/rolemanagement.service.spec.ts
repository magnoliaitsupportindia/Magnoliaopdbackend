import { Test, TestingModule } from '@nestjs/testing';
import { RolemanagementService } from './rolemanagement.service';

describe('RolemanagementService', () => {
  let service: RolemanagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolemanagementService],
    }).compile();

    service = module.get<RolemanagementService>(RolemanagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
