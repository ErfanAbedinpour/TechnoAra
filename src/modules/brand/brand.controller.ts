import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UserRole } from '../../models/role.model';
import { Role } from '../auth/decorator/role.decorator';
import { GetUser } from '../auth/decorator/get-user.decorator';

@Controller('brand')
@Role(UserRole.ADMIN)
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Post()
  create(@GetUser('id') userId: number, @Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(userId, createBrandDto);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
