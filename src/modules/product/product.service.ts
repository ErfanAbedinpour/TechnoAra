import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto, CreateProductRespone } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../models/product.model';
import Decimal from 'decimal.js';
import { ErrorMessages } from '../../errorResponse/err.response';
import { DriverException, EntityManager, ForeignKeyConstraintViolationException, NotFoundError, UniqueConstraintViolationException } from '@mikro-orm/postgresql';
import { GetAllProductResponse } from './dto/get-product';
import { Attribute } from '../../models/attribute.model';
import { ProductAttribute } from '../../models/product-attribute.model';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUES } from '../../enums/queues.enum';
import { Queue } from 'bullmq';
import { ImageJobCreator, ProductJobName, RemoveProductImageJob, UploadProductImageJob } from './job/product-file.job';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);

  constructor(
    private readonly em: EntityManager,
    @InjectQueue(QUEUES.PRODUCT_FILE) readonly queue: Queue
  ) { }

  async getProductById(id: number) {

    try {
      const p = await this.em.findOneOrFail(Product, { id }, {
        refresh: true
      })

      return p;
    } catch (err) {
      this.mikroOrmErrorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException();
    }
  }

  private mikroOrmErrorHandler(err: Error) {
    if (err instanceof DriverException) {
      if (err.code === "21000") {
        throw new BadRequestException(ErrorMessages.ATTRIBUTES_NOT_VALID);
      }
    }

    if (err instanceof NotFoundError) {
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND)
    }

    if (err instanceof UniqueConstraintViolationException) {
      throw new ConflictException(ErrorMessages.INVALID_SLUG)
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
        default: {
          throw new BadRequestException(ErrorMessages.UNKNOWN_ERROR)
        }
      }

    }
  }

  async create({ category, description, brand, inventory, price, slug, title }: CreateProductDto, userId: number): Promise<CreateProductRespone> {

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
        brand: brand
      }, { persist: true, partial: true });

      await this.em.flush();

      return (product as unknown) as CreateProductRespone;
    } catch (err) {
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
        populate: ['category', 'brand', 'images'],
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
        exclude: ["attributes.product", "brand.user", "images.createdAt", 'images.updatedAt'],
        populate: ['comments', "attributes", "brand", 'category', 'orders', 'images'],
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

      /*
        user send product attribute like this 
        size 13ich
        ram 6GB
        ....
        if this attribute exsist in Db append them to productAttribute Table 
        and if not exsist create them.
       */
      /*
        store attributes and productAttributes into array 
        and insert whole them at once for decrease IO 
       */
      const attributes: Attribute[] = [];
      const productAttributes: ProductAttribute[] = [];

      if (updateProductDto.attributes) {

        for (const { name, value } of updateProductDto.attributes) {
          // create instance of attribute
          const attribute = this.em.create(Attribute, { name, createdAt: Date.now(), updatedAt: Date.now() });

          // push attribute into list for whole at once
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

  async remove(id: number) {
    try {
      // find product 
      const product = await this.getProductById(id);
      for (const img of product.images) {
        await this.queue.add(ProductJobName.remove, ImageJobCreator<RemoveProductImageJob>({ key: img.src, productId: product.id }));
      }
      // remove them
      await this.em.removeAndFlush(product)
      return product;
    } catch (err) {
      if (err instanceof NotFoundError)
        throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  // remove product Attribute
  async removeAttribute(productId: number, attributeName: string): Promise<{ success: boolean }> {

    // get product
    const product = await this.getProductById(productId);

    try {
      // get attribute by name
      const attribute = await this.em.findOne(ProductAttribute, { product, attribute: { name: attributeName } });


      if (!attribute)
        throw new NotFoundException(ErrorMessages.ATTRIBUTES_NOT_VALID)

      // remove them
      await this.em.removeAndFlush(attribute);

      return { success: true }
    } catch (err) {
      if (err instanceof HttpException)
        throw err;

      this.mikroOrmErrorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException();
    }
  }


  async saveImages(productId: number, files: { main: Express.Multer.File[], product_gallery: Express.Multer.File[] }) {
    // getProduct
    const product = await this.getProductById(productId);

    if (files.main?.length) {
      await this.queue.add(ProductJobName.upload, ImageJobCreator<UploadProductImageJob>({ file: files.main[0], productId: product.id, isTitle: true }), {
        attempts: 3,
      })
    }

    if (files.product_gallery?.length) {

      files.product_gallery.forEach(async (file) =>
        await this.queue.add(ProductJobName.upload, ImageJobCreator<UploadProductImageJob>({ file: file, productId: product.id, isTitle: false })
        ))
    }

    // store File Into Cloud
    try {
      return { success: true, msg: "image uploaded successfully" }
    } catch (err) {
      throw err;
    }
  }
}
