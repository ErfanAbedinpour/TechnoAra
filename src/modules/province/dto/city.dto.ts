import { ApiProperty } from "@nestjs/swagger";

export class CityDto {
    @ApiProperty()
    title: string

    @ApiProperty()
    slug: string

    @ApiProperty()
    en_name: string

    @ApiProperty()
    latitude: string

    @ApiProperty()
    longitude: string
}