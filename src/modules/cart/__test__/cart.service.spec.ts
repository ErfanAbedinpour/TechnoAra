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
import { ProductService } from '../../product/product.service';
import { Cart } from '../../../models/cart.model';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessages } from '../../../errorResponse/err.response';

describe('CartService', () => {
  let service: CartService;
  let em: EntityManager;
  let user: User
  let userCart: Cart;
  let productServiceMock: Partial<ProductService> = {
    getProductById: jest.fn()
  }


  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(DB_TEST_CONFIG)],
      providers: [CartService, {
        provide: ProductService,
        useValue: productServiceMock
      }],
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
    it("should be thorw BadRequest becuase quantity is 0", async () => {

      jest.spyOn(productServiceMock, "getProductById").mockResolvedValueOnce(
        await em.findOne(Product, 1)
      )

      const resPromsie = service.addProduct(user.id, { productId: 1 })
      expect(resPromsie).rejects.toThrow(BadRequestException)
      expect(resPromsie).rejects.toThrow(ErrorMessages.PRODUCT_QUANTITY)
    })

  })





});
