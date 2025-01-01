import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { ResponseDto } from "../../../abstract/response.abstract";
import { Exclude, Expose } from "class-transformer";

export class RefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    refreshToken: string
}

export class RefreshTokenResponse implements ResponseDto {
    @Expose()
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    @Expose()
    refreshToken: string;
}