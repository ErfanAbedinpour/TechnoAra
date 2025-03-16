import { ApiProperty } from "@nestjs/swagger";
import { CityDto } from "../../province/dto/city.dto";

export class AddressDto {

    @ApiProperty()
    id: number
    @ApiProperty()
    postal_code: string

    @ApiProperty()
    street: string

    @ApiProperty({ type: () => CityDto })
    city: CityDto
}