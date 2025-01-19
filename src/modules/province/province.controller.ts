import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Auth, AUTH_STRATEGIES } from '../auth/decorator/auth.decorator';

@Controller('province')
@Auth(AUTH_STRATEGIES.NONE)
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) { }

  @Get()
  findAll() {
    return this.provinceService.findProvinces();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.provinceService.findProvinceById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProvinceDto: UpdateProvinceDto) {
    return this.provinceService.update(id, updateProvinceDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.provinceService.remove(id);
  }
}
