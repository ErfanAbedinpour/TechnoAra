import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBrandDto {
    @MaxLength(50)
    @MinLength(3)
    @IsString()
    @IsNotEmpty()
    name: string
}
