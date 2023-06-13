import { Test, TestingModule } from '@nestjs/testing';
import { OpdRegisterService } from './opd-register.service';

describe('OpdRegisterService', () => {
  let service: OpdRegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpdRegisterService],
    }).compile();

    service = module.get<OpdRegisterService>(OpdRegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
