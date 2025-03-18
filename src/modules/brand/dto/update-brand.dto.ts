import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BrandDto } from './brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    @IsNotEmpty()
    @ApiProperty()
    name: string;
}


export class UpdateBrandResponse extends BrandDto { }