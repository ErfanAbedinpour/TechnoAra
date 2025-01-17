import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CategoryResponse, CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryResponse } from './dto/update-category.dto';
import { EntityManager, NotFoundError, UniqueConstraintViolationException, wrap } from '@mikro-orm/postgresql';
import { Category } from '../../models/category.model';
import { ErrorMessages } from '../../errorResponse/err.response';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(private readonly em: EntityManager) { }


  // private method for handling MikroOrm Exceptions
  private mikroOrmErrorHandler(err: Error) {
    if (err instanceof UniqueConstraintViolationException) {
      throw new ConflictException(ErrorMessages.INVALID_SLUG)
    }
    if (err instanceof NotFoundError) {
      throw new NotFoundException(ErrorMessages.CATEGORY_NOT_FOUNT)
    }
  }

  getCategoryById(id: number) {
    return this.em.findOneOrFail(Category, id);

  }

  async create(userId: number, { slug, title, en_name, isActivate }: CreateCategoryDto): Promise<CategoryResponse> {
    const category = this.em.create(Category, { slug, en_name, title, user: userId, isActivate: isActivate ?? true });

    try {

      await this.em.persistAndFlush(category);

      return (category as unknown) as CategoryResponse;

    } catch (err) {
      this.mikroOrmErrorHandler(err);
      this.logger.error(err);
      throw new InternalServerErrorException(ErrorMessages.UNKNOWN_ERROR)

    }
  }

  async findAll() {
    try {
      const [categoryies, count] = await this.em.findAndCount(Category, {});
      const meta = {
        countOfCategory: count,
        activateCategoryies: categoryies.filter(category => category.isActivate === true).length,
        diActiveCategoryies: categoryies.filter(category => category.isActivate === false).length
      }
      return { categoryies, meta }
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException()
    }
  }
  async findOne(id: number) {
    try {
      const category = await this.em.findOneOrFail(Category, id, { populate: ['user'] });

      return category;
    } catch (err) {
      this.mikroOrmErrorHandler(err);
      this.logger.error(err);
      throw new InternalServerErrorException()
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<UpdateCategoryResponse> {
    try {
      // get category
      const category = await this.getCategoryById(id);
      // update category
      const new_category = wrap(category).assign(updateCategoryDto);

      await this.em.flush();

      return (new_category as unknown) as UpdateCategoryResponse;
    } catch (err) {
      this.mikroOrmErrorHandler(err);
      this.logger.error(err);
      throw new InternalServerErrorException(err)
    }

  }

  async remove(id: number) {

    try {
      const category = await this.getCategoryById(id);
      await this.em.removeAndFlush(category);
      return true;
    } catch (err) {
      this.mikroOrmErrorHandler(err)
      this.logger.error(err);
      throw new InternalServerErrorException()

    }
  }
}