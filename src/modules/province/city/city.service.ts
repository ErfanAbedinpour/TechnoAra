import { EntityManager, NotFoundError } from "@mikro-orm/postgresql";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { City } from "../../../models/city.model";
import { ErrorMessages } from "../../../errorResponse/err.response";

@Injectable()
export class CityService {
    constructor(
        private readonly em: EntityManager,
    ) { }

    private errorHandler(err: Error) {
        if (err instanceof NotFoundError)
            throw new NotFoundException(ErrorMessages.CITY_NOT_FOUND)


    }

    async getCity(provinceSlug: string, citySlug: string) {
        try {
            const city = await this.em.findOneOrFail(City, { province: { slug: provinceSlug }, slug: citySlug })
            return city
        } catch (err) {
            this.errorHandler(err)
            throw new InternalServerErrorException()
        }
    }
    async findCitiesByProvinceSlug(slug: string) {

        const [cities, count] = await this.em.findAndCount(City, { province: { slug } });

        return {
            cities,
            count
        }

    }

    // // remove city
    // async remove(provinceId: number, citySlug: string) {
    //     try {
    //         const city = await this.em.findOneOrFail(City, { province: provinceId, slug: citySlug })
    //         await this.em.removeAndFlush(city);
    //         return city
    //     } catch (err) {
    //         this.errorHandler(err)
    //         throw new InternalServerErrorException()
    //     }
    // }

    // // update city
    // async update(provinceId: number, citySlug: string, updateCityDto: UpdateCityDto) {
    //     try {
    //         const city = await this.em.findOneOrFail(City, { province: provinceId, slug: citySlug }, { populate: ['province'] })

    //         for (const key in updateCityDto) {
    //             if (updateCityDto[key]) {
    //                 city[key] = updateCityDto[key]
    //             }
    //         }
    //         await this.em.flush()
    //         return city;
    //     } catch (err) {
    //         this.errorHandler(err)
    //         throw new InternalServerErrorException()
    //     }

    // }
}