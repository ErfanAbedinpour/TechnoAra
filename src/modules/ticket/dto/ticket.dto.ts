import { ApiProperty } from "@nestjs/swagger";
import { TicketDepartment, TicketStatus } from "../../../models/ticket.model";

export class TicketDto {
    @ApiProperty({ default: "ticket id" })
    id: number
    @ApiProperty({ description: "ticket title" })
    title: string;
    @ApiProperty({ description: "ticket body" })
    body: string
    @ApiProperty({ description: "ticket status" })
    status: TicketStatus
    @ApiProperty({ description: "ticket department" })
    department: TicketDepartment
    @ApiProperty({ description: "ticket uuid" })
    identify: string
    @ApiProperty({ description: "ticket user" })
    user: number
}