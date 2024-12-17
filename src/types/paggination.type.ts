import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Min } from "class-validator";

export class Pagination {
    @ApiProperty()
    @Type(() => Number)
    @Min(1)
    limit: number = 10;
    @ApiProperty()
    @Type(() => Number)
    @Min(1)
    page: number = 1;
}