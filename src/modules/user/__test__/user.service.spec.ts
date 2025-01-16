import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { DB_TEST_CONFIG } from '../../../config/db.test.config';

describe('UserService', () => {
  let service: UserService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(DB_TEST_CONFIG)],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    em = module.get(EntityManager)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
  });
});
