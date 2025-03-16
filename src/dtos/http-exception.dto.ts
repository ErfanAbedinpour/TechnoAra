import { ApiProperty } from "@nestjs/swagger";

export class HttpExceptionDto {
    @ApiProperty()
    message: string
    @ApiProperty()
    error: string
    @ApiProperty()
    statusCode: number
}