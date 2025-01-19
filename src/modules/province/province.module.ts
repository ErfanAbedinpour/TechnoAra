import { Global, Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { CityService } from './city/city.service';
import { ProvinceCityController } from './province-city.controller';

@Module({
  controllers: [ProvinceController, ProvinceCityController],
  providers: [ProvinceService, CityService],
  exports: [ProvinceService, CityService],
})
export class ProvinceModule { }
