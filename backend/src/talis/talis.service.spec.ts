import { Test, TestingModule } from '@nestjs/testing';
import { TalisService } from './talis.service';

describe('TalisService', () => {
  let service: TalisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TalisService],
    }).compile();

    service = module.get<TalisService>(TalisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
