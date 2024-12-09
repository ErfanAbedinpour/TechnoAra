import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RefreshTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    refreshToken: string
}

export class RefreshTokenResponse {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}