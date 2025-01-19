import { Controller, Get, Param } from "@nestjs/common";
import { ProvinceService } from "./province.service";
import { CityService } from "./city/city.service";
import { Auth, AUTH_STRATEGIES } from "../auth/decorator/auth.decorator";



@Controller("province/:provinceSlug/city")
@Auth(AUTH_STRATEGIES.NONE)
export class ProvinceCityController {

    constructor(private readonly cityService: CityService) { }

    @Get()
    findProvinceCity(@Param("provinceSlug") slug: string) {
        return this.cityService.findCitiesByProvinceSlug(slug)
    }

    @Get(":citySlug")
    findCity(@Param("provinceSlug") provinceSlug: string, @Param("citySlug") citySlug) {
        return this.cityService.getCity(provinceSlug, citySlug)
    }
}