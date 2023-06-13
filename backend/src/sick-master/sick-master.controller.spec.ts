import { Test, TestingModule } from '@nestjs/testing';
import { SickMasterController } from './sick-master.controller';
import { SickMasterService } from './sick-master.service';

describe('SickMasterController', () => {
  let controller: SickMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SickMasterController],
      providers: [SickMasterService],
    }).compile();

    controller = module.get<SickMasterController>(SickMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
