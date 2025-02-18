import { Module } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { TicketController } from "./ticket.controller";

@Module({
    providers: [TicketService],
    controllers: [TicketController]
})
export class TicketModule { }
