import { IsEmail, isNotEmpty, IsNotEmpty } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}


export class UserLoginResponse {
    accessToken: string;
    refreshToken: string;
}