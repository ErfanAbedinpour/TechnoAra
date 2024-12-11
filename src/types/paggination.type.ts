import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, Min } from "class-validator";

export class Pagination {
    @ApiProperty()
    @IsNotEmpty({ message: "please enter limit in query param" })
    @Type(() => Number)
    @Min(1)
    limit: number;
    @ApiProperty()
    @IsNotEmpty({ message: "please enter page in query param" })
    @Type(() => Number)
    @Min(1)
    page: number;
}