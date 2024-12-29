import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { CreateProductRespone } from '../../product/dto/create-product.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }


export class UpdateCategoryResponse extends CreateProductRespone { }