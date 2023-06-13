import { Test, TestingModule } from '@nestjs/testing';
import { RolemanagementController } from './rolemanagement.controller';
import { RolemanagementService } from './rolemanagement.service';

describe('RolemanagementController', () => {
  let controller: RolemanagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolemanagementController],
      providers: [RolemanagementService],
    }).compile();

    controller = module.get<RolemanagementController>(RolemanagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
