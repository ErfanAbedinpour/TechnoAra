import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(80)
    slug: string

    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    isActivate: boolean

    @IsNotEmpty()
    @IsString()
    en_name: string
}
