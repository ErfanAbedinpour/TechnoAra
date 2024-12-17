import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../models/product.model';
import Decimal from 'decimal.js';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';
import { ErrorMessages } from '../../errorResponse/err.response';
import { EntityManager, UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);
  constructor(
    private readonly em: EntityManager,) { }

  async create(createProductDto: CreateProductDto, userId: number) {
    const { category, description, price, quantity, slug, title } = createProductDto;

    const [categoryEntity, userEntity] = await Promise.all([
      this.em.findOne(Category, { id: category }),
      this.em.findOne(User, { id: userId })
    ])

    if (!categoryEntity)
      throw new BadRequestException(ErrorMessages.CATEGORY_NOT_FOUNT)

    if (!userEntity)
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND)

    const decimalPrice = new Decimal(price);

    try {
      const product = this.em.create(Product, {
        category: categoryEntity,
        price: decimalPrice,
        slug: slug,
        inventory: quantity,
        describtion: description,
        title,
        user: userEntity
      })

      await this.em.insert(product);
      // return product
      return product;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof UniqueConstraintViolationException) {
        throw new BadRequestException(ErrorMessages.INVALID_SLUG)
      }
    }
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
