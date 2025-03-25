import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto, CreateProductResponse } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../models/product.model';
import { ErrorMessages } from '../../errorResponse/err.response';
import { DriverException, EntityManager, ForeignKeyConstraintViolationException, NotFoundError, UniqueConstraintViolationException } from '@mikro-orm/postgresql';
import { GetAllProductResponse } from './dto/get-product';
import { ProductAttribute } from '../../models/product-attribute.model';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUES } from '../../enums/queues.enum';
import { Queue } from 'bullmq';
import { ProductJobName, RemoveProductImageJob, UploadProductImageJob } from './interface/job.interface';
import { ImageJobCreator } from './job/product-file.job';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from './commands/create-product.command';
import { ProductByIdQuery } from './queries/product-by-id.query';
import { FindProductQuery } from './queries/get-product.query';
import { UpdateProductCommand } from './commands/update-product.command';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectQueue(QUEUES.PRODUCT_FILE) readonly queue: Queue
  ) { }

  async getProductById(id: number) {

    try {
      const res = await this.queryBus.execute(new ProductByIdQuery(id))
      return res
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

  async create({ category, description, brand, inventory, price, slug, title }: CreateProductDto, userId: number): Promise<CreateProductResponse> {
    const res = await this.commandBus.execute(new CreateProductCommand(
      userId,
      title,
      slug, inventory, description, price, category, brand
    ))
    return res;
  } catch(err) {
    this.mikroOrmErrorHandler(err);
    this.logger.error(err)
    throw new InternalServerErrorException()
  }

  async findAll(limit: number, page: number): Promise<GetAllProductResponse> {
    try {
      const res = await this.queryBus.execute(new FindProductQuery(limit, page))
      return res
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async findOne(slug: string) {
    try {
      // find product and join brand and category and orders and comments
      const product = await this.em.findOneOrFail(Product, { slug }, {
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
    try {
      const res = await this.commandBus.execute(new UpdateProductCommand(id, updateProductDto))
      return res
    } catch (err) {
      this.mikroOrmErrorHandler(err);
      this.logger.error(err)
      throw new InternalServerErrorException();
    }

  }

  async remove(id: number) {
    // find product 
    try {
      const product = await this.em.findOneOrFail(Product, id, { populate: ['images.src'] });

      for (const img of product.images) {
        console.log('product image is : ', img)
        await this.queue.add(ProductJobName.remove, ImageJobCreator<RemoveProductImageJob>({ key: img.src, productId: product.id }));
      }
      // remove them
      await this.em.removeAndFlush(product)
      return product;
    } catch (err) {
      this.mikroOrmErrorHandler(err)
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
