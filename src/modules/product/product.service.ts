import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto, CreateProductRespone } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../models/product.model';
import Decimal from 'decimal.js';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';
import { ErrorMessages } from '../../errorResponse/err.response';
import { EntityManager, ForeignKeyConstraintViolationException, NotFoundError } from '@mikro-orm/postgresql';
import slugify from 'slugify';
import { GetAllProductResponse } from './dto/get-product';
import { Brand } from '../../models/brand.model';
import { Attribute } from '../../models/attribute.model';
import { ProductAttribute } from '../../models/product-attribute.model';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);
  constructor(
    private readonly em: EntityManager) { }

  private async getProductById(id: number) {
    const product = await this.em.findOne(Product, { id }, { refresh: true })

    if (!product)
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND)

    return product;
  }

  private async isValidSlug(slug: string): Promise<boolean> {
    return !this.em.findOne(Product, { slug })
  }

  async create(createProductDto: CreateProductDto, userId: number): Promise<CreateProductRespone> {
    let { category, description, brand, price, quantity, slug, title } = createProductDto;
    slug = slugify(slug, {
      replacement: "-",
      lower: true,
      trim: true
    })


    const [brandInstance, categoryInstance, userInstance] = await Promise.all([
      this.em.findOne(Brand, { id: brand }),
      this.em.findOne(Category, { id: category }, { exclude: ["createdAt", "updatedAt", "user"] }),
      this.em.findOne(User, { id: userId })
    ])

    if (!categoryInstance)
      throw new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUNT)

    if (!userInstance)
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND)

    const decimalPrice = new Decimal(price);

    try {
      const qb = this.em.createQueryBuilder(Product);

      const result = await qb.insert(
        {
          category: categoryInstance,
          price: decimalPrice,
          slug: slug,
          inventory: quantity,
          describtion: description,
          title,
          user: userInstance,
          brand: brandInstance,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ).returning(["id", "title", "price", "user", "inventory", "category", "slug", "brand"]).execute("get");

      return result;
    } catch (err) {
      if (err.code && err.code === "23505")
        throw new BadRequestException(ErrorMessages.INVALID_SLUG)

      this.logger.error(err)
      throw new InternalServerErrorException()

    }
  }

  async findAll(limit: number, page: number): Promise<GetAllProductResponse> {
    const offset = (page - 1) * limit;
    try {
      const [products, count] = await this.em.findAndCount(Product, { inventory: { $gte: 1 } }, {
        limit: limit,
        offset,
        fields: ["category.title", "user.username", "title", "slug", "price", "inventory", "brand.name"],
        populate: ['category', 'brand'],
        orderBy: { id: "asc" }
      })

      return {
        products,
        meta: {
          countAll: count,
          count: products.length,
          allPages: Math.ceil(count / limit) || 1,
          page,
        }
      };
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async findOne(id: number) {
    try {
      // find product and join brand and category and orders and comments
      const product = await this.em.findOneOrFail(Product, { id }, {
        exclude: ["attributes.products", "brand.user"],
        populate: ['comments', "attributes", "brand", 'category', 'orders'],
        orderBy: { id: "asc" }
      });

      return { product }
    } catch (err) {
      if (err instanceof NotFoundError)
        throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND)
      this.logger.error(err)
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.getProductById(id);
    //validate product

    try {
      if (updateProductDto.attributes) {
        for (const { name, value } of updateProductDto.attributes) {
          const attribute = await this.em.upsert(Attribute, { name, createdAt: Date.now(), updatedAt: Date.now() });
          const productAttribute = this.em.create(ProductAttribute, { attribute, product, value });
          // TODO: Upsert Product Attribute for Update value of Attribute On ProductAtribute
          this.em.persist(productAttribute);
        }
      }

      for (const prop in updateProductDto) {
        if (prop !== 'attributes' && updateProductDto[prop]) {
          product[prop] = updateProductDto[prop];
        }
      }

      // const res = await this.em.upsert(Product, product);
      await this.em.flush();
      return true
    } catch (err) {
      if (err instanceof ForeignKeyConstraintViolationException) {
        //@ts-ignore
        switch (err.constraint) {
          case "products_brand_id_foreign": {
            throw new BadRequestException(ErrorMessages.BRAND_NOT_FOUND)
          }
          case "products_category_id_foreign": {
            throw new BadRequestException(ErrorMessages.CATEGORY_NOT_FOUNT)
          }
        }
        throw new InternalServerErrorException(err.stack)
      }
      // this.logger.error(err)
      console.error(err)
      throw new InternalServerErrorException();
    }

  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
