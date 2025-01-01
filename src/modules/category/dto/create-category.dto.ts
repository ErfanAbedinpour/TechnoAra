import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ResponseDto } from "../../../abstract/response.abstract";
import { Expose } from "class-transformer";

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(80)
    slug: string

    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    isActivate: boolean

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    en_name: string
}

export class CategoryResponse implements ResponseDto {
    @Expose()
    @ApiProperty()
    "id": number;
    @Expose()
    @ApiProperty()
    "createdAt": string
    @ApiProperty()
    @Expose()
    "updatedAt": string;
    @ApiProperty()
    @Expose()
    "slug": string;
    @Expose()
    @ApiProperty()
    "title": string;
    @Expose()
    @ApiProperty()
    "isActivate": boolean
    @ApiProperty()
    @Expose()
    "user": number
    @ApiProperty()
    @Expose()
    "en_name": string
}
