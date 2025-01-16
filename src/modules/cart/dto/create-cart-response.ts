import { ApiProperty } from "@nestjs/swagger"

export class CartDto {
    @ApiProperty()
    id: number
    @ApiProperty()
    user: number
    @ApiProperty()
    createdAt: string
    @ApiProperty()
    updatedAt: string
}

export class ProductDto {

    @ApiProperty()
    id: number
    @ApiProperty()
    "createdAt": string
    @ApiProperty()
    "updatedAt": string;
    @ApiProperty()
    "title": string
    @ApiProperty()
    "slug": string
    @ApiProperty()
    "inventory": number
    @ApiProperty()
    "description": string
    @ApiProperty()
    "user": number
    @ApiProperty()
    "price": string
    @ApiProperty()
    "category": number
    @ApiProperty()
    "brand": string
}