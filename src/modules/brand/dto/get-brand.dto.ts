import { ApiProperty } from "@nestjs/swagger";
import { BrandDto } from "./brand.dto";

export class FindOneBrandResponse extends BrandDto { }

export class FindAllBrandResonse {
    @ApiProperty()
    count: number;
    @ApiProperty({ type: [BrandDto] })
    brands: BrandDto[]
}