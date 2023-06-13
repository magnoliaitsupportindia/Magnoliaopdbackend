import { Test, TestingModule } from '@nestjs/testing';
import { IncidentMasterController } from './incident-master.controller';
import { IncidentMasterService } from './incident-master.service';

describe('IncidentMasterController', () => {
  let controller: IncidentMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncidentMasterController],
      providers: [IncidentMasterService],
    }).compile();

    controller = module.get<IncidentMasterController>(IncidentMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
