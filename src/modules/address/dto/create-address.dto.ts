import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateAddressDto {
    @ApiProperty({ description: "your post code " })
    @IsString()
    @IsNotEmpty()
    postal_code: string

    @ApiProperty({ description: "your address" })
    @IsNotEmpty()
    @IsString()
    street: string

    @ApiProperty({ description: "city slug ", example: "Babol" })
    @IsString()
    @IsNotEmpty()
    city_slug: string

    @ApiProperty({ description: "province slug ", example: "mazandaran" })
    @IsString()
    @IsNotEmpty()
    province_slug: string
}
