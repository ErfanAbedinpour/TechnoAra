import { IsNotEmpty } from "class-validator";

export class CallBackDto {
    @IsNotEmpty()
    Authority: string

    @IsNotEmpty()
    Status: string
}