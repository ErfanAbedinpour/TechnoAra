import { Type } from "class-transformer";
import { IsNotEmpty, Min } from "class-validator";

export class Pagination {
    @IsNotEmpty({ message: "please enter limit in query param" })
    @Type(() => Number)
    @Min(1)
    limit: number;
    @IsNotEmpty({ message: "please enter page in query param" })
    @Type(() => Number)
    @Min(1)
    page: number;
}