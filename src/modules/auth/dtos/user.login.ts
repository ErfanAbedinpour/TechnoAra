import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, isNotEmpty, IsNotEmpty } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}


export class UserLoginResponse {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}