import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, CreateProductRespone } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "product created successfully", type: CreateProductRespone })
  @ApiBadRequestResponse({ description: "slug is already taken." })
  @ApiNotFoundResponse({ description: "category or user information invalid." })
  @Role(UserRole.ADMIN)
  create(@GetUser('id') userId: number, @Body() createProductDto: CreateProductDto): Promise<CreateProductRespone> {
    return this.productService.create(createProductDto, userId);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
