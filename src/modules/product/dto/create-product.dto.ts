import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min, MinLength } from "class-validator";
import Decimal from "decimal.js";


export class CreateProductDto {
    @MinLength(5)
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;
    @MinLength(5)
    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    slug: string
    @IsNotEmpty()
    @Min(1)
    @IsNumber()
    @ApiProperty()
    quantity: number
    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @ApiProperty()
    description: string
    @IsNumberString()
    @IsNotEmpty()
    @ApiProperty()
    price: string
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    category: number
}
