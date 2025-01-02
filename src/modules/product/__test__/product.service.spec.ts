import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DB_TEST_CONFIG } from '../../../config/db.test.config';
import { EntityManager } from '@mikro-orm/postgresql';
import { Product } from '../../../models/product.model';
import Decimal from 'decimal.js';
import { User } from '../../../models/user.model';
import { Brand } from '../../../models/brand.model';
import { Category } from '../../../models/category.model';
import { Role, UserRole } from '../../../models/role.model';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../../../errorResponse/err.response';


describe('ProductService', () => {
  let service: ProductService;
  let em: EntityManager
  let product: Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(DB_TEST_CONFIG)],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    em = module.get<EntityManager>(EntityManager);
    const price = new Decimal(12000);

    const role = em.create(Role, { name: UserRole.ADMIN })
    const user = em.create(User, { createdAt: Date.now(), updatedAt: Date.now(), username: "hiii", password: "12341234", email: "mail@gmail.com", role: role })
    const brand = em.create(Brand, { createdAt: Date.now(), updatedAt: Date.now(), name: "test", user })
    const category = em.create(Category, { createdAt: Date.now(), updatedAt: Date.now(), title: "test-titile", en_name: "test", slug: "test-slug", user })

    product = em.create(Product,
      {
        slug: "valid",
        title: "test",
        description: "test product",
        price,
        user,
        category,
        brand,
        inventory: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    )
    em.flush();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
  });


  describe("creating product", () => {
    it("slug is invalid. should thorw Error", async () => {
      const resPromise = service.create({ slug: "valid", brand: 1, category: 1, description: "test", inventory: 122, price: "1222", title: 'test' }, 1)
      expect(resPromise).rejects.toThrow(ConflictException)
      expect(resPromise).rejects.toThrow(ErrorMessages.INVALID_SLUG)
    })

    it("invalid brand ", () => {
      const resPromise = service.create({ slug: "valid-2", brand: 12, category: 1, description: "test", inventory: 122, price: "1222", title: 'test' }, 1)
      expect(resPromise).rejects.toThrow(BadRequestException)
    })

    it("should be created ok", () => {
      const product = { slug: "valid-3", brand: 1, category: 1, description: "test", inventory: 1, price: "1222", title: 'test' }
      const resPromise = service.create(product, 1)
      expect(resPromise).resolves.toBeTruthy();
      expect(resPromise).resolves.not.toBeNull();
    })
  })

  it("should be throw NotFound if Product not Found", () => {
    expect(service.getProductById(23)).rejects.toThrow(NotFoundException)
    expect(service.getProductById(23)).rejects.toThrow(ErrorMessages.PRODUCT_NOT_FOUND)
  })

  describe("update product", function () {
    it("should be update product", async function () {
      const product = await em.findOne(Product, 1);
      const resPromsie = service.update(product.id, {
        title: "newTitle",
        attributes: [{ name: "size", value: "13inch" }],
      })
      expect(resPromsie).resolves.toBeTruthy();
      expect((await resPromsie).title).toEqual(product.title);
      expect(product.attributes.length).toEqual(1);
      expect(product.attributes[0].attribute.name).toEqual('size');
    })
  })

  describe("delete product", function () {
    it("should be deleted", async () => {
      const resPromise = service.remove(1);
      expect(resPromise).resolves.toBeTruthy();
      expect((await resPromise).id).toEqual(1);
    })
  })


  describe("remove Product Attribute", () => {
    it("should be throw notFound attribute", async () => {
      const res = await service.update(1, {
        attributes: [{ name: "size", value: "13inch" }, { "name": "ram", value: "6GB" }],
      })

      const resPromise = service.removeAttribute(res.id, "inch");

      expect(resPromise).rejects.toThrow(NotFoundException)
      expect(resPromise).rejects.toThrow(ErrorMessages.ATTRIBUTES_NOT_VALID)
    })
    it("should be attribute remove successfully", async () => {
      const res = await service.update(1, {
        attributes: [{ name: "size", value: "13inch" }, { "name": "ram", value: "6GB" }],
      })

      expect(res.attributes.length).toBe(2)

      const result = await service.removeAttribute(res.id, "ram");
      expect(result).toStrictEqual({ success: true })

      const product = await em.findOne(Product, 1)
      expect(product.attributes.length).toBe(1)
    })
  })
});
