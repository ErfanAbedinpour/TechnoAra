import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResponse, CreateCategoryDto } from './dto/create-category.dto';
import {
  UpdateCategoryDto,
  UpdateCategoryResponse,
} from './dto/update-category.dto';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../../models/role.model';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { SlugifyInterceptor } from '../../interceptor/slugify.interceptor';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ResponseStructure } from '../../decorator/resposne-stucture.decorator';

@Controller('category')
@Role(UserRole.ADMIN)
@UseInterceptors(SlugifyInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'category created successfully',
    type: CategoryResponse,
  })
  @ApiBadRequestResponse({ description: 'category slug is used before' })
  @ResponseStructure(CategoryResponse)
  @ApiBearerAuth()
  create(
    @GetUser('id') userId: number,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponse> {
    return this.categoryService.create(userId, createCategoryDto);
  }

  @ApiOkResponse({ description: 'fetch categoriyes successfully' })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOkResponse({ description: 'fetch category successfully' })
  @ApiNotFoundResponse({ description: 'category not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @ApiOkResponse({
    description: 'category updated successfully',
    type: UpdateCategoryResponse,
  })
  @ApiNotFoundResponse({ description: 'category not found' })
  @ResponseStructure(UpdateCategoryResponse)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateCategoryResponse> {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'category removed successfully' })
  @ApiNotFoundResponse({ description: 'category not found' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
