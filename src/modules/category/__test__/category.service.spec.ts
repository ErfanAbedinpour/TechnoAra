import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EntityManager, SqliteDriver, UniqueConstraintViolationException } from '@mikro-orm/sqlite';
import { Category } from '../../../models/category.model';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../models/role.model';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../../../errorResponse/err.response';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { DB_TEST_CONFIG } from '../../../config/db.test.config';

describe('CategoryService', () => {
  let service: CategoryService;
  let em: EntityManager;
  let c1: Category
  let u1: User
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot(DB_TEST_CONFIG),
      ],
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    em = module.get<EntityManager>(EntityManager);


    u1 = em.create(User, { id: 1, username: "fakeUser", role: { name: UserRole.ADMIN }, email: "fake@gmail.com", password: "12341234" },)

    c1 = em.create(Category, {
      id: 1,
      slug: 'test-category',
      title: 'fake-title',
      en_name: 'fake',
      user: u1
    });

    await em.flush();
  })
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(c1).toBeDefined();
  });


  describe("create Category ", () => {

    it("should be thorw error for invaid slug", async () => {
      const resPromise = service.create(u1.id, { slug: "test-category", en_name: "fake", title: 'newCategory', isActivate: undefined })
      expect(resPromise).rejects.toThrow(ConflictException)
      expect(resPromise).rejects.toThrow(ErrorMessages.INVALID_SLUG)
    })

    it("should be created ok", async () => {
      const resPromise = service.create(u1.id, { slug: "new-slug", en_name: "fake", title: 'newCategory', isActivate: undefined })
      expect(resPromise).resolves.toBeTruthy();
    })
  })

  describe("get category", () => {

    it("should be thorw NotFound Error for invaid category id", async () => {
      const resPromise = service.findOne(1234);
      expect(resPromise).rejects.toThrow(NotFoundException)
    })

    it("should be get thruthy ", async () => {
      const resPromise = service.findOne(1)
      expect(resPromise).resolves.toBeTruthy();
    })
  })

  describe("update", () => {
    const paylaod: UpdateCategoryDto = { en_name: "new-en-name", slug: "new-slug-second" };

    it("should be throw notFound for category not found", () => {
      const resPromise = service.update(122, paylaod);
      expect(resPromise).rejects.toThrow(NotFoundException)
      expect(resPromise).rejects.toThrow(ErrorMessages.CATEGORY_NOT_FOUNT)
    })

    it("should be get thruthy ", async () => {
      const resPromise = service.update(1, paylaod)
      expect(resPromise).resolves.toBeTruthy();
      expect(resPromise).resolves.toBeInstanceOf(Category)
      expect(resPromise).resolves.toHaveProperty("en_name", paylaod.en_name)
      expect(resPromise).resolves.toHaveProperty("slug", paylaod.slug)
      expect(resPromise).resolves.toHaveProperty("isActivate", true)
    })
  })


  describe("delete category", () => {
    it("should be throw not found for category not found", () => {
      const resPromise = service.remove(1234);
      expect(resPromise).rejects.toThrow(NotFoundException)
      expect(resPromise).rejects.toThrow(ErrorMessages.CATEGORY_NOT_FOUNT)
    })

    it("should be remove ok", async () => {
      const resPromise = service.remove(1);
      expect(resPromise).resolves.toEqual(true)
      await resPromise
      expect(em.findOne(Category, 1)).resolves.toBe(null)
    })
  })
});
