import { PartialType } from '@nestjs/mapped-types';
import { IsAlpha, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProvinceDto {

    @IsString()
    @IsOptional()
    title: string

    @IsString()
    @IsOptional()
    @IsAlpha()
    en_name: string

    @IsString()
    @IsOptional()
    slug: string

    @IsString()
    @IsOptional()
    latitude: string

    @IsString()
    @IsOptional()
    longitude: string
}
