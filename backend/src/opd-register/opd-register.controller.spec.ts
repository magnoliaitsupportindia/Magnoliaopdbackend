import { Test, TestingModule } from '@nestjs/testing';
import { OpdRegisterController } from './opd-register.controller';
import { OpdRegisterService } from './opd-register.service';

describe('OpdRegisterController', () => {
  let controller: OpdRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpdRegisterController],
      providers: [OpdRegisterService],
    }).compile();

    controller = module.get<OpdRegisterController>(OpdRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
