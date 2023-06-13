import { Test, TestingModule } from '@nestjs/testing';
import { TalisController } from './talis.controller';
import { TalisService } from './talis.service';

describe('TalisController', () => {
  let controller: TalisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalisController],
      providers: [TalisService],
    }).compile();

    controller = module.get<TalisController>(TalisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
