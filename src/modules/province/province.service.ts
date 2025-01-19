import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { EntityManager, NotFoundError, PrimaryKey, UniqueConstraintViolationException, wrap } from '@mikro-orm/postgresql';
import { ErrorMessages } from '../../errorResponse/err.response';
import { Province } from '../../models/province.model';

@Injectable()
export class ProvinceService {
  constructor(private readonly em: EntityManager) { }

  private readonly logger = new Logger(ProvinceService.name)

  private errorHandler(err: Error) {
    if (err instanceof UniqueConstraintViolationException) {
      throw new BadRequestException(ErrorMessages.SLUG_UNIQUE);
    }
    if (err instanceof NotFoundError)
      throw new NotFoundException(ErrorMessages.PROVINCE_NOT_FOUND)

  }


  async findProvinces() {
    try {

      const [provinces, count] = await this.em.findAndCount(Province, {})

      return {
        provinces,
        count
      }
    } catch (err) {

      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async findProvinceBySlug(slug: string) {
    try {
      return await this.em.findOneOrFail(Province, { slug });
    } catch (err) {
      this.errorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async update(id: number, updateProvinceDto: UpdateProvinceDto) {
    try {

      let province = await this.em.findOneOrFail(Province, id);

      for (const key in updateProvinceDto) {
        if (updateProvinceDto[key]) {
          province[key] = updateProvinceDto[key]
        }
      }

      await this.em.flush();

      return province
    } catch (err) {
      this.errorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async remove(id: number) {
    try {

      let province = await this.em.findOneOrFail(Province, id);

      await this.em.removeAndFlush(province);

      return province
    } catch (err) {
      this.errorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async findCityBySlug(slug: string) {
    const [cities, count] = await this.em.findAndCount(Province, { slug }, { populate: ['cities'] });
    return {
      cities,
      count
    }

  }
}
