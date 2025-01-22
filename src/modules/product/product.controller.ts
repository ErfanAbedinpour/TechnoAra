import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFiles } from '@nestjs/common';
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
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../../pipes/file-size.pipe';
import { Auth, AUTH_STRATEGIES } from '../auth/decorator/auth.decorator';
import { FileMimeValidationPipe } from '../../pipes/file-mime.pipe';

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

  @Get(":id")
  @ApiOkResponse({ description: "product fetched successfully" })
  @ApiNotFoundResponse({ description: "product not found" })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }


  @ApiOkResponse({ description: "product updated successfully", type: UpdateProductDto })
  @ApiNotFoundResponse({ description: "Product not found" })
  @ApiBearerAuth()
  @Patch(':id')
  @Role(UserRole.ADMIN)
  @UseInterceptors(SlugifyInterceptor)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }


  @ApiOkResponse({ description: "attribute remvoe successfully" })
  @ApiNotFoundResponse({ description: "Product not found" })
  @ApiBadRequestResponse({ description: "attribute not found" })
  @ApiBearerAuth()
  @Delete(":id/:attrName")
  @Role(UserRole.ADMIN)
  removeAttribute(@Param("id", ParseIntPipe) id: number, @Param("attrName") attrName: string) {
    return this.productService.removeAttribute(id, attrName);
  }

  @ApiOkResponse({ description: "product remove successfully" })
  @ApiNotFoundResponse({ description: "product not found" })
  @ApiBearerAuth()
  @Delete(':id')
  @Role(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Post(":id/images")
  @Auth(AUTH_STRATEGIES.NONE)
  @UseInterceptors(FileFieldsInterceptor([
    {
      name: "main",
      maxCount: 1
    },
    {
      name: "product-gallery"
    }

  ]))
  saveImages(@Param('id', ParseIntPipe) productId: number, @UploadedFiles(
    new FileSizeValidationPipe(["main", "product-gallery"]),
    new FileMimeValidationPipe(["main", "product-gallery"], ['image/jpeg', 'image/png'])
  )
  files: { main: Express.Multer.File[], productGallery: Express.Multer.File[] }) {
    return this.productService.saveImages(productId, { main: files.main[0], gallery: files.productGallery })
  }
}
