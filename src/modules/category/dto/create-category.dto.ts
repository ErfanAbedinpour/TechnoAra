import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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

export class CategoryCreateResponse {
    @ApiProperty()
    "id": number;
    @ApiProperty()
    "createdAt": string
    @ApiProperty()
    "updatedAt": string;
    @ApiProperty()
    "slug": string;
    @ApiProperty()
    "title": string;
    @ApiProperty()
    "isActivate": boolean
    @ApiProperty()
    "user": number
    @ApiProperty()
    "en_name": string
}
