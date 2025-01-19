import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { EntityManager, NotFoundError } from '@mikro-orm/postgresql';
import { Address } from '../../models/address.model';
import { City } from '../../models/city.model';
import { ErrorMessages } from '../../errorResponse/err.response';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name)

  constructor(private readonly em: EntityManager) { }



  private errorHandler(err: Error) {
    if (err instanceof NotFoundError)
      throw new NotFoundException(ErrorMessages.ADDRESS_NOT_FOUND)

    throw err;
  }

  async create(userId: number, { postal_code, city, province, street }: CreateAddressDto) {

    // find user City
    const userCity = await this.em.findOne(City, { slug: city, province: { slug: province } });
    // if city not found 
    if (!userCity)
      throw new NotFoundException(ErrorMessages.CITY_NOT_FOUND)

    const address = this.em.create(Address, {
      postal_code,
      city: userCity,
      street,
      user: userId
    })

    try {
      await this.em.persistAndFlush(address);
      return address
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async getUserCities(userId: number) {
    // get user cities
    const addresses = await this.em.findAll(
      Address, {
      where: { user: userId },
      populate: ["city"]
    });

    return addresses
  }


  async update(addressId: number, updateAddressDto: UpdateAddressDto) {

    try {
      const address = await this.em.findOneOrFail(Address, { id: addressId });

      if (updateAddressDto.city && updateAddressDto.province) {
        // find user City
        const userCity =
          await this.em.findOne(City, { slug: updateAddressDto.city, province: { slug: updateAddressDto.province } })

        if (!userCity)
          throw new BadRequestException(ErrorMessages.CITY_NOT_FOUND)

        address.city = userCity;
      }

      // updated value in address if value in dto is exsist
      for (const key in updateAddressDto) {
        if (key !== 'city' && key !== 'province') {
          address[key] = updateAddressDto[key];
        }
      }

      await this.em.flush();
      return address
    } catch (err) {
      this.errorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async remove(addressId: number) {

    try {
      const address = await this.em.findOneOrFail(Address, { id: addressId });
      await this.em.removeAndFlush(address);
      return address
    } catch (err) {
      this.errorHandler(err)
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }
}
