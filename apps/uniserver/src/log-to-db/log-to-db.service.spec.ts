import { Test, TestingModule } from '@nestjs/testing';
import { LogToDbService } from './log-to-db.service';

describe('LogToDbService', () => {
  let service: LogToDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogToDbService],
    }).compile();

    service = module.get<LogToDbService>(LogToDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
