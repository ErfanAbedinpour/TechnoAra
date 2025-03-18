import { ApiProperty } from "@nestjs/swagger";
import { ResponseDto } from "../../../abstract/response.abstract";

export class LogoutResponse implements ResponseDto {
    @ApiProperty()
    message: string;
}