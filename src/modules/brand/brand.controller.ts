import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UserRole } from '../../models/role.model';
import { Role } from '../auth/decorator/role.decorator';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BrandDto } from './dto/brand.dto';
import { HttpExceptionDto } from '../../dtos/http-exception.dto';

@Controller('brand')
@Role(UserRole.ADMIN)
@ApiTags("Admin")
@ApiBearerAuth("JWT_AUTH")
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @ApiBody({ type: CreateBrandDto })
  @ApiCreatedResponse({ description: "created successfully", type: BrandDto })
  @ApiConflictResponse({ description: "name is taken", type: HttpExceptionDto })
  @ApiNotFoundResponse({ description: "user is not found", type: HttpExceptionDto })
  @Post()
  create(@GetUser('id') userId: number, @Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(userId, createBrandDto);
  }

  @Get()
  @ApiOkResponse({ description: "brand created successfully", type: [BrandDto], isArray: true })
  findAll() {
    return this.brandService.findAll();
  }

  @ApiOkResponse({ description: "brand fetched successfully", type: BrandDto })
  @ApiNotFoundResponse({ description: "brand not found", type: HttpExceptionDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findById(+id);
  }

  @ApiOkResponse({ description: "brand updated successfully", type: BrandDto })
  @ApiNotFoundResponse({ description: "brand not found", type: HttpExceptionDto })
  @ApiBody({ type: UpdateBrandDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @ApiOkResponse({ description: "brand removed successfully", type: BrandDto })
  @ApiNotFoundResponse({ description: "brand not found", type: HttpExceptionDto })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
