import { ApiProperty } from "@nestjs/swagger";
import { TicketDepartment, TicketStatus } from "../../../models/ticket.model";

export class TicketDto {
    @ApiProperty({ default: "ticket id" })
    id: number
    @ApiProperty({ description: "ticket title" })
    title: string;
    @ApiProperty({ description: "ticket body" })
    body: string
    @ApiProperty({ enum: () => TicketStatus, description: "ticket status" })
    status: TicketStatus
    @ApiProperty({ enum: () => TicketDepartment, description: "ticket department" })
    department: TicketDepartment
    @ApiProperty({ description: "Ticket uuid" })
    identify: string

    @ApiProperty({ description: "created Type(timestamp)" })
    createdAt: number
}