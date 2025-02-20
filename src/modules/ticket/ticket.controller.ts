import { Body, Controller, Post } from "@nestjs/common";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { GetUser } from "../auth/decorator/get-user.decorator";
import { TicketService } from "./ticket.service";
import { ApiCreatedResponse } from "@nestjs/swagger";



@Controller("ticket")
export class TicketController {
    constructor(private readonly ticketService: TicketService) { }
    // create Ticket Dto
    @ApiCreatedResponse({ description: "ticket created successfully" })
    @Post()
    create(@Body() ticketDto: CreateTicketDto, @GetUser("id") userId: number) {
        return this.ticketService.create(ticketDto, userId);
    }

}