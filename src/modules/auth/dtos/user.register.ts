import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(3)
    username: string
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsString()
    @IsNotEmpty()
    password: string

}