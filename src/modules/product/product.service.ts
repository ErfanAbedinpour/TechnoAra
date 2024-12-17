import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto, CreateProductRespone } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../models/product.model';
import Decimal from 'decimal.js';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';
import { ErrorMessages } from '../../errorResponse/err.response';
import { EntityManager } from '@mikro-orm/postgresql';
import slugify from 'slugify';

@Injectable()
export class ProductService {
  private logger = new Logger(ProductService.name);
  constructor(
    private readonly em: EntityManager) { }

  async create(createProductDto: CreateProductDto, userId: number): Promise<CreateProductRespone> {
    let { category, description, price, quantity, slug, title } = createProductDto;
    slug = slugify(slug, {
      replacement: "-",
      lower: true,
      trim: true
    })

    const [categoryInstance, userInstance] = await Promise.all([
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
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      ).returning(["id", "title", "price", "user", "inventory", "category", "slug"]).execute("get");

      return result;
    } catch (err) {
      if (err.code && err.code === "23505")
        throw new BadRequestException(ErrorMessages.INVALID_SLUG)

      this.logger.error(err)
      throw new InternalServerErrorException()

    }
  }

  async findAll(limit: number, page: number) {
    const offset = (page - 1) * limit;

    try {
      const [products, count] = await this.em.findAndCount(Product, {}, {
        limit: limit,
        offset,
        fields: ["category.title", "user.username", "title", "slug", "price", "inventory"],
        populate: ['category'],
        orderBy: { id: "asc" }
      })
      return {
        products,
        meta: {
          countRow: count,
          count: products.length,
          allpages: Math.ceil(count / limit) || 1,
          page,
        }
      };
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
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
