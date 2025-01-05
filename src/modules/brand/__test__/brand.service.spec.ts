import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from '../brand.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../models/user.model';
import { Brand } from '../../../models/brand.model';
import { DB_TEST_CONFIG } from '../../../config/db.test.config';
import { Role, UserRole } from '../../../models/role.model';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../../../errorResponse/err.response';

describe('BrandService', () => {
  let service: BrandService;
  let em: EntityManager;
  let brand: Brand;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(DB_TEST_CONFIG)],
      providers: [BrandService],
    }).compile();

    service = module.get<BrandService>(BrandService);
    em = module.get<EntityManager>(EntityManager)

    const role = em.create(Role, { name: UserRole.ADMIN })
    const user = em.create(User, { username: "test", password: "test1234", email: "test@gmail.com", role })
    brand = em.create(Brand, { name: "test", user });

    await em.persistAndFlush([role, user, brand])
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(brand).toBeDefined();
  });


  describe("findById", () => {

    it("should be throw NotFound ", () => {
      const resPromise = service.findById(10)
      expect(resPromise).rejects.toThrow(NotFoundException)
      expect(resPromise).rejects.toThrow(ErrorMessages.BRAND_NOT_FOUND)
    })

    it("Should be throw successfully", () => {
      const resPromise = service.findById(1)
      expect(resPromise).resolves.toBeTruthy()
      expect(resPromise).resolves.toHaveProperty("id", brand.id)
      expect(resPromise).resolves.toHaveProperty("name", brand.name)
    })
  })


  describe("create new Brand", () => {
    it("should be throw Conflict for invalid name", () => {
      const resPromsie = service.create(1, { name: "test" });

      expect(resPromsie).rejects.toThrow(ConflictException)
      expect(resPromsie).rejects.toThrow(ErrorMessages.INVALID_BRAND)
    })


    it("Should be throw BadRequest to invalid user", () => {

      const resPromsie = service.create(123, { name: "test2" });

      expect(resPromsie).rejects.toThrow(BadRequestException)
      expect(resPromsie).rejects.toThrow(ErrorMessages.USER_NOT_FOUND)
    })


    it("Should be created successfully", () => {
      const resPromsie = service.create(1, { name: "test2" });
      expect(resPromsie).resolves.toBeTruthy()
      expect(resPromsie).resolves.toHaveProperty("id", 2)
      expect(resPromsie).resolves.toHaveProperty("name", "test2")
    })
  })


  describe("Update", () => {
    beforeEach(async () => {
      await service.create(1, { name: "new-test" })
    })

    it("should be throw Conflict to invalid name", async () => {
      const resPromsie = service.update(1, { name: "new-test" });
      expect(resPromsie).rejects.toThrow(ConflictException)
      expect(resPromsie).rejects.toThrow(ErrorMessages.INVALID_BRAND)
    })

    it("Should be changed name successfully", () => {
      const resPromsie = service.update(1, { name: "new-test2" });
      expect(resPromsie).resolves.toBeTruthy()
      expect(resPromsie).resolves.toHaveProperty("id", 1)
      expect(resPromsie).resolves.toHaveProperty("name", "new-test2")
    })
  })

  describe("remove", () => {
    beforeEach(async () => {
      await service.create(1, { name: "new-test" })
    })

    it("remove brand", async () => {
      const resPromsie = service.remove(1);

      expect(resPromsie).resolves.toBeTruthy()
      expect(await resPromsie).toHaveProperty('success', true)
      expect(await service.findAll()).toHaveProperty('count', 1)
    })
  })
});
