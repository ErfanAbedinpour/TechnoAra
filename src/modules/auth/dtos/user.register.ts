import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { ResponseDto } from "../../../abstract/response.abstract";
import { Expose } from "class-transformer";

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(3)
    @ApiProperty()
    username: string
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;
    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string

}

export class RegisterUserResponse implements ResponseDto {
    @Expose()
    @ApiProperty()
    success: boolean
}