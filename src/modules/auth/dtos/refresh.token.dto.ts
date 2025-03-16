import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ResponseDto } from "../../../abstract/response.abstract";

export class RefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    refreshToken: string
    @ApiProperty()
    @IsNotEmpty()
    accessToken: string

}
export class LogoutDto {
    @ApiProperty()
    @IsNotEmpty()
    refreshToken: string
    @ApiProperty()
    @IsNotEmpty()
    accessToken: string
}

export class RefreshTokenResponse implements ResponseDto {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}