import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ResponseDto } from "../../../abstract/response.abstract";

export class LogoutResponse implements ResponseDto {
    @Expose()
    @ApiProperty()
    message: string;
}