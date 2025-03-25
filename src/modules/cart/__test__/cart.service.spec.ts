import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DB_TEST_CONFIG } from '../../../config/db.test.config';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../models/user.model';
import { Role } from '../../auth/decorator/role.decorator';
import { UserRole } from '../../../models/role.model';
import { Product } from '../../../models/product.model';
import Decimal from 'decimal.js';
import { Brand } from '../../../models/brand.model';
import { Category } from '../../../models/category.model';
import { Cart } from '../../../models/cart.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../../../errorResponse/err.response';
import { ProductModule } from '../../product/product.module';

describe('CartService', () => {
  let service: CartService;
  let em: EntityManager;
  let user: User
  let userCart: Cart;


  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(DB_TEST_CONFIG), ProductModule],
      providers: [CartService],
    }).compile();

    service = module.get<CartService>(CartService);
    em = module.get<EntityManager>(EntityManager);

    // create a fake items 
    const role = em.create(Role, { name: UserRole.ADMIN }, { persist: true })
    user = em.create(User, { email: "test@gmail.com", username: "test", password: "12341234", role }, { persist: true })
    userCart = em.create(Cart, { user })
    const brand = em.create(Brand, { name: "test", user })
    const category = em.create(Category, { slug: "test", en_name: "test-slug", title: "test-title", user })


    for (let i = 0; i < 5; i++) {
      const price = new Decimal(12999);

      em.create(Product, {

        brand,
        category,
        title: `test-title-${i}`,
        description: `test-description-${i}`,
        inventory: i,
        user,
        slug: `test-slug-${i}`,
        price,
      }, { persist: true })
    }

    await em.flush();

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(em).toBeDefined();
    expect(user).toBeDefined();
    expect(userCart).toBeDefined();
    expect(userCart.user.id).toEqual(1);
    expect(userCart.products.length).toEqual(0)
  });

  describe("Add Product", () => {
    it("should be thorw BadRequest becuase product quantity is 0", async () => {

      const resPromsie = service.addProduct(user.id, { productId: 1 })
      expect(resPromsie).rejects.toThrow(BadRequestException)
      expect(resPromsie).rejects.toThrow(ErrorMessages.PRODUCT_QUANTITY)
    })


    it("should be add Product into Cart", async () => {
      const resPromise = service.addProduct(user.id, { productId: 2 });

      expect(resPromise).resolves.toBeTruthy()
      expect(resPromise).resolves.toHaveProperty("count", 1)

    })

    it("should be increase one to product count ", async () => {
      await service.addProduct(user.id, { productId: 3 });

      const resPromise = service.addProduct(user.id, { productId: 3 });

      expect(resPromise).resolves.toBeTruthy()
      expect(resPromise).resolves.toHaveProperty("count", 2)

    })

    it("should be throw BadRequest for Product inventory not enough", async () => {
      await service.addProduct(user.id, { productId: 2 });

      const resPromise = service.addProduct(user.id, { productId: 2 });
      expect(resPromise).rejects.toThrow(BadRequestException)
      expect(resPromise).rejects.toThrow(ErrorMessages.PRODUCT_QUANTITY)

    })

  })

  describe("get User Cart", () => {
    beforeEach(async () => {
      await service.addProduct(user.id, { productId: 3 }),
        await Promise.all([
          service.addProduct(user.id, { productId: 3 }),
          service.addProduct(user.id, { productId: 2 }),
        ])
    })



    it("Should be get user cart", async () => {
      const res = service.getUserCartProducts(user.id);

      expect(res).resolves.toBeTruthy()
      expect(res).resolves.toHaveLength(2)
      expect((await res)[0]).toHaveProperty('count', 2)
      expect((await res)[1]).toHaveProperty('count', 1)

    })


    it("Should be Remove one product from UserCart", async () => {
      const res = service.remove(3, user.id);


      expect(res).resolves.toBeTruthy()

      expect(await res).toHaveProperty('count', 1)

    })


    it("Should be thorw NotFound if Product not found From UserCart", () => {
      const resPromise = service.remove(20, user.id)


      expect(resPromise).rejects.toThrow(NotFoundException)
      expect(resPromise).rejects.toThrow(ErrorMessages.PRODUCT_NOT_EXSIST_IN_YOUR_CART)
    })
  })


  afterAll(() => {


  })


});
