import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({
        description: "name for brand",
        minLength: 3,
        maxLength: 50
    })
    @MaxLength(50)
    @MinLength(3)
    @IsString()
    @IsNotEmpty()
    name: string
}

export class BrandDto {
    @ApiProperty()
    id: number
    @ApiProperty()
    name: string
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
    @ApiProperty()
    user: number
}