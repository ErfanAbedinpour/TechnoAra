import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAddressDto {
    @IsString()
    @IsNotEmpty()
    postal_code: string

    @IsNotEmpty()
    @IsString()
    street: string

    @IsString()
    @IsNotEmpty()
    city: string

    @IsString()
    @IsNotEmpty()
    province: string
}
