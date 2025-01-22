import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DB_TEST_CONFIG } from '../../../config/db.test.config';
import { EntityManager } from '@mikro-orm/postgresql';
import { CityService } from '../../province/city/city.service';
import { ProvinceModule } from '../../province/province.module';

describe('AddressService', () => {
  let service: AddressService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(DB_TEST_CONFIG), ProvinceModule],
      providers: [AddressService],
    }).compile();

    service = module.get<AddressService>(AddressService);
    em = module.get<EntityManager>(EntityManager)
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
  });
});
