import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, CreateProductRespone } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { Pagination } from '../../types/paggination.type';
import { GetAllProductResponse } from './dto/get-product';
import { SlugifyInterceptor } from '../../interceptor/slugify.interceptor';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Role(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "product created successfully", type: CreateProductRespone })
  @ApiBadRequestResponse({ description: "slug is already taken." })
  @ApiNotFoundResponse({ description: "category or user information invalid." })
  @UseInterceptors(SlugifyInterceptor)
  create(@GetUser('id') userId: number, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto, userId);
  }

  @ApiOkResponse({ description: "products find successfully", type: GetAllProductResponse })
  @Get()
  findAll(@Query() { limit, page }: Pagination): Promise<GetAllProductResponse> {
    return this.productService.findAll(limit, page);
  }

  @Get(':id')
  @ApiOkResponse({ description: "product fetched successfully" })
  @ApiNotFoundResponse({ description: "product not found" })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  @UseInterceptors(SlugifyInterceptor)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
