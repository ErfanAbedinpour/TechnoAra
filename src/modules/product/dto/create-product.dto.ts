import { PlainObject } from "@mikro-orm/core";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min, MinLength } from "class-validator";
import Decimal from "decimal.js";


export class CreateProductDto extends PlainObject {
    @MinLength(5)
    @ApiProperty({
        required: true,
        name: "title",
        example: "Iphone12Ch",
        minLength: 5
    })
    @IsString()
    @IsNotEmpty()
    title: string;
    @MinLength(5)
    @IsString()
    @ApiProperty({
        required: true,
        name: "slug",
        example: "phone 12",
        description: "wihtout /",
        minLength: 5
    })
    @IsNotEmpty()
    slug: string
    @IsNotEmpty()
    @Min(1)
    @IsNumber()
    @ApiProperty({
        required: true,
        name: "inventory",
        example: 5,
        description: "qauntity of product",
        minimum: 1
    })
    inventory: number
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
    @ApiProperty({
        description: "category id"
    })
    category: number
    @IsNotEmpty({ message: "brand_id is required" })
    @ApiProperty({
        description: "brand_id"
    })
    @IsNumber()
    @Min(1)
    brand: number
}


export class CreateProductRespone {
    @ApiProperty()
    "id": number

    @ApiProperty()
    "title": string

    @ApiProperty()
    "slug": string

    @ApiProperty()
    "inventory": number

    @ApiProperty()
    "user": number

    @ApiProperty()
    "price": Decimal

    @ApiProperty()
    "category": number
}