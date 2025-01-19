import { Controller, Get, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { CityService } from './city/city.service';
import { Auth, AUTH_STRATEGIES } from '../auth/decorator/auth.decorator';


@Controller('province')
@Auth(AUTH_STRATEGIES.NONE)
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService, private readonly cityService: CityService) { }

  @Get()
  findAll() {
    return this.provinceService.findProvinces();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.provinceService.findProvinceBySlug(slug);
  }

  @Patch(':id')
  @Auth(AUTH_STRATEGIES.BEARER)
  @Role(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProvinceDto: UpdateProvinceDto) {
    return this.provinceService.update(id, updateProvinceDto);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  @Auth(AUTH_STRATEGIES.BEARER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.provinceService.remove(id);
  }

}
