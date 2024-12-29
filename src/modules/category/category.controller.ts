import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryCreateResponse, CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryResponse } from './dto/update-category.dto';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { SlugifyInterceptor } from '../../interceptor/slugify.interceptor';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiResponseProperty } from '@nestjs/swagger';

@Controller('category')
@Role(UserRole.ADMIN)
@UseInterceptors(SlugifyInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @ApiCreatedResponse({ description: "category created successfully", type: CategoryCreateResponse })
  @ApiBadRequestResponse({ description: "category slug is used before" })
  create(@GetUser('id') userId: number, @Body() createCategoryDto: CreateCategoryDto): Promise<CategoryCreateResponse> {
    return this.categoryService.create(userId, createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<UpdateCategoryResponse> {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
