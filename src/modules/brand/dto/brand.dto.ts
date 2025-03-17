import { ApiProperty } from "@nestjs/swagger"

export class BrandDto {
    @ApiProperty()
    id: number
    @ApiProperty()
    name: string
}