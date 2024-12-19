import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';



export class AttributeDto {
    @IsString()
    name: string
    @IsString()
    value: string
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AttributeDto)
    attributes: AttributeDto[]
}
