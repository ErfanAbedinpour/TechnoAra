import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { EntityManager, NotFoundError } from '@mikro-orm/postgresql';
import { Address } from '../../models/address.model';
import { City } from '../../models/city.model';
import { ErrorMessages } from '../../errorResponse/err.response';
import { CityService } from '../province/city/city.service';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name)

  constructor(private readonly em: EntityManager, private readonly cityService: CityService) { }



  private errorHandler(err: Error) {
    if (err instanceof NotFoundError)
      throw new NotFoundException(ErrorMessages.ADDRESS_NOT_FOUND)

    throw err;
  }

  async create(userId: number, { postal_code, city, province, street }: CreateAddressDto) {

    // find user City
    const userCity = await this.cityService.getCity(province, city);
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

  async getUserAddresses(userId: number) {
    // get user cities
    const addresses = await this.em.findAll(
      Address, {
      where: { user: userId },
      populate: ["city"]
    });

    return addresses
  }


  async update(addressId: number, updateAddressDto: UpdateAddressDto) {

    const address = await this.em.findOne(Address, { id: addressId });

    if (!address)
      throw new NotFoundException(ErrorMessages.ADDRESS_NOT_FOUND)

    if (updateAddressDto.city || updateAddressDto.province) {

      if (!updateAddressDto.province || !updateAddressDto.city)
        throw new BadRequestException(`${ErrorMessages.PROVINCE_EMPTY} or ${ErrorMessages.CITY_EMPTY}`);

      // find user City
      const userCity = await this.cityService.getCity(updateAddressDto.province, updateAddressDto.city)

      address.city = userCity;
    }

    // updated value in address if value in dto is exsist
    for (const key in updateAddressDto) {
      if (key !== 'city' && key !== 'province') {
        address[key] = updateAddressDto[key];
      }
    }

    try {
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
