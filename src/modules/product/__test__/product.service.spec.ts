import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DB_TEST_CONFIG } from '../../../config/db.test.config';
import { EntityManager } from '@mikro-orm/postgresql';

describe('ProductService', () => {
  let service: ProductService;
  let em: EntityManager

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(DB_TEST_CONFIG)],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
  });
});
