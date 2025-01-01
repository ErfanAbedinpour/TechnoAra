import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, isNotEmpty, IsNotEmpty } from "class-validator";
import { ResponseDto } from "../../../abstract/response.abstract";
import { Expose } from "class-transformer";

export class UserLoginDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}


export class UserLoginResponse implements ResponseDto {
    @Expose()
    @ApiProperty()
    accessToken: string;
    @Expose()
    @ApiProperty()
    refreshToken: string;
}