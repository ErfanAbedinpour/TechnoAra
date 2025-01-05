import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { EntityManager, ForeignKeyConstraintViolationException, NotFoundError, UniqueConstraintViolationException, wrap } from '@mikro-orm/postgresql';
import { Brand } from '../../models/brand.model';
import { ErrorMessages } from '../../errorResponse/err.response';

@Injectable()
export class BrandService {
  private readonly logger = new Logger(BrandService.name);

  constructor(private readonly em: EntityManager,
  ) { }


  private mikroOrmErrorHandler(err: Error) {
    if (err instanceof ForeignKeyConstraintViolationException) {
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND)
    }

    if (err instanceof UniqueConstraintViolationException) {
      throw new ConflictException(ErrorMessages.INVALID_BRAND)
    }

    if (err instanceof NotFoundError) {
      throw new NotFoundException(ErrorMessages.BRAND_NOT_FOUND);
    }
  }


  async findById(id: number) {
    try {
      return await this.em.findOneOrFail(Brand, id)
    } catch (err) {
      this.mikroOrmErrorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async create(userId: number, { name }: CreateBrandDto) {
    const brand = this.em.create(Brand, { user: userId, name });

    try {
      await this.em.persistAndFlush(brand);
      return brand;
    } catch (err) {
      this.mikroOrmErrorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async findAll() {
    const [brands, count] = await this.em.findAndCount(Brand, {});
    return { count, brands };
  }

  async findOne(id: number) {
    // findBrand By Id
    const brand = await this.findById(id);
    try {
      // return brand
      return brand
    } catch (err) {
      this.mikroOrmErrorHandler(err);
      this.logger.error(err);
      throw new InternalServerErrorException()
    }
  }



  async update(id: number, updateBrandDto: UpdateBrandDto) {
    // find brand 
    const brand = await this.findById(id);
    try {
      // update them
      const newBrand = wrap(brand).assign(updateBrandDto, { em: this.em });

      await this.em.flush();
      return newBrand
    } catch (err) {
      this.mikroOrmErrorHandler(err)
      this.logger.error(err);
      throw new InternalServerErrorException()
    }
  }

  async remove(id: number) {
    const brand = await this.findById(id)
    try {
      await this.em.removeAndFlush(brand);
      return { success: true }
    } catch (err) {
      this.mikroOrmErrorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }
}