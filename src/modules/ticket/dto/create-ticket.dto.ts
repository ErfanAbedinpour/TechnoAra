import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TicketDepartment } from "../../../models/ticket.model";

export class CreateTicketDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    body: string

    @ApiProperty({ enum: () => TicketDepartment })
    @IsEnum(TicketDepartment)
    @IsString()
    department: TicketDepartment

}