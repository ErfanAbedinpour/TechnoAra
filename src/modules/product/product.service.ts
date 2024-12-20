import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto, CreateProductRespone } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../models/product.model';
import Decimal from 'decimal.js';
import { ErrorMessages } from '../../errorResponse/err.response';
import { DriverException, EntityManager, ForeignKeyConstraintViolationException, NotFoundError, UniqueConstraintViolationException } from '@mikro-orm/postgresql';
import { GetAllProductResponse } from './dto/get-product';
import { Attribute } from '../../models/attribute.model';
import { ProductAttribute } from '../../models/product-attribute.model';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);
  constructor(
    private readonly em: EntityManager) { }

  private async getProductById(id: number) {

    const product = await this.em.findOne(Product, { id }, {
      refresh: true
    })

    if (!product)
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND)

    return product;
  }


  private mikroOrmErrorHandler(err: Error) {
    if (err instanceof DriverException) {
      if (err.code === "21000") {
        throw new BadRequestException(ErrorMessages.ATTRIBUTES_NOT_VALID);
      }
    }

    if (err instanceof UniqueConstraintViolationException) {
      //@ts-ignore
      switch (err.constraint) {
        case "products_slug_unique": {
          throw new BadRequestException(ErrorMessages.INVALID_SLUG)
        }
      }
    }

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
    }
  }


  async create(createProductDto: CreateProductDto, userId: number): Promise<CreateProductRespone> {
    let { category, description, brand, price, inventory, slug, title } = createProductDto;


    const decimalPrice = new Decimal(price);

    try {
      const product = this.em.create(Product, {
        category: category,
        price: decimalPrice,
        slug: slug,
        inventory: inventory,
        description: description,
        title,
        user: userId,
        brand: brand,
      }, { persist: true, partial: true });

      await this.em.flush();

      return (product as unknown) as CreateProductRespone;
    } catch (err) {
      console.error(err)
      this.mikroOrmErrorHandler(err);
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
        exclude: ["attributes.product", "brand.user"],
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
      const attributes: Attribute[] = [];
      const productAttributes: ProductAttribute[] = [];

      if (updateProductDto.attributes) {

        for (const { name, value } of updateProductDto.attributes) {
          // create instance of attribute
          const attribute = this.em.create(Attribute, { name, createdAt: Date.now(), updatedAt: Date.now() });

          // push attribute into list for upsert at once
          attributes.push(attribute);
          productAttributes.push({ attribute, value, product: product });
        }
      }

      for (const [prop, value] of Object.entries(updateProductDto)) {
        if (prop !== "attributes" && value && product[prop] !== value) {
          this.em.assign(product, { [prop]: value });
        }
      }

      // upsert attributes 
      await this.em.upsertMany(
        Attribute,
        attributes,
        { onConflictFields: ['name'], onConflictAction: "ignore" })

      await Promise.all([
        this.em.upsertMany(
          ProductAttribute,
          productAttributes,
          { onConflictFields: ["attribute", "product"], onConflictAction: "merge", onConflictMergeFields: ["value"] }),
        this.em.flush()
      ])

      return product
    } catch (err) {
      this.mikroOrmErrorHandler(err);
      this.logger.error(err)
      throw new InternalServerErrorException();
    }

  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
