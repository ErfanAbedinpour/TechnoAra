import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandDto, CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto, UpdateBrandResponse } from './dto/update-brand.dto';
import { UserRole } from '../../models/role.model';
import { Role } from '../auth/decorator/role.decorator';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ResponseStructure } from '../../decorator/resposne-stucture.decorator';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { FindAllBrandResonse, FindOneBrandResponse } from './dto/get-brand.dto';
import { RemoveBrandResponse } from './dto/remove-brand.dto';

@Controller('brand')
@Role(UserRole.ADMIN)
@ApiTags("brand")
@ApiBearerAuth("JWT_AUTH")
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @ResponseStructure(BrandDto)
  @ApiBody({ type: CreateBrandDto })
  @ApiCreatedResponse({ description: "created successfully", type: BrandDto })
  @ApiConflictResponse({ description: "name is taken" })
  @ApiNotFoundResponse({ description: "user is not found" })
  @Post()
  create(@GetUser('id') userId: number, @Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(userId, createBrandDto);
  }

  @Get()
  @ApiOkResponse({ description: "brand created successfully", type: FindAllBrandResonse })
  findAll() {
    return this.brandService.findAll();
  }

  @ApiOkResponse({ description: "brand fetched successfully", type: FindOneBrandResponse })
  @ApiNotFoundResponse({ description: "brand not found" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @ApiOkResponse({ description: "brand updated successfully", type: UpdateBrandResponse })
  @ApiNotFoundResponse({ description: "brand not found" })
  @ResponseStructure(UpdateBrandResponse)
  @ApiBody({ type: UpdateBrandDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @ApiOkResponse({ description: "brand removed successfully", type: RemoveBrandResponse })
  @ApiNotFoundResponse({ description: "brand not found" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
