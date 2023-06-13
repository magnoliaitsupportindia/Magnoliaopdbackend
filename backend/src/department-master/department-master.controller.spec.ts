import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentMasterController } from './department-master.controller';
import { DepartmentMasterService } from './department-master.service';

describe('DepartmentMasterController', () => {
  let controller: DepartmentMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentMasterController],
      providers: [DepartmentMasterService],
    }).compile();

    controller = module.get<DepartmentMasterController>(
      DepartmentMasterController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
