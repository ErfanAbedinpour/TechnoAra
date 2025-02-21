import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { GetUser } from "../auth/decorator/get-user.decorator";
import { TicketService } from "./ticket.service";
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from "@nestjs/swagger";
import { TicketDto } from "./dto/ticket.dto";
import { Role } from "../auth/decorator/role.decorator";
import { UserRole } from "../../models/role.model";
import { UpdateTicketDto } from "./dto/update-ticket.dto";



@Controller("ticket")
export class TicketController {
    constructor(private readonly ticketService: TicketService) { }
    // create Ticket Dto
    @ApiCreatedResponse({ description: "ticket created successfully", type: TicketDto })
    @Post()
    async create(@Body() ticketDto: CreateTicketDto, @GetUser("id") userId: number): Promise<TicketDto> {
        const { body, department, id, identify, user, status, title } = await this.ticketService.create(ticketDto, userId);
        return {
            id,
            body,
            department,
            status,
            title,
            identify,
            user: user.id
        }
    }

    // findOne
    @Get('id')
    @ApiOkResponse({ description: "get ticket successfully", })
    @ApiNotFoundResponse({ description: "ticket not found", })
    @Role(UserRole.ADMIN)
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.ticketService.getById(id);
    }

    // findAll
    @Get()
    @ApiOkResponse({ description: "tickets fetched successfully", })
    @Role(UserRole.ADMIN)
    findAll() {
        return this.ticketService.getAll();
    }

    // update
    @Patch("id")
    @ApiOkResponse({ description: "tickets updated successfully", })
    @ApiNotFoundResponse({ description: "ticket not found", })
    update(@Param("id", ParseIntPipe) id: number, @Body() updateTicketDto: UpdateTicketDto) {
        return this.ticketService.update(updateTicketDto, id);
    }
    // remove
    @Delete("id")
    @ApiOkResponse({ description: "ticket remove successfully", })
    @ApiNotFoundResponse({ description: "ticket not found", })
    delete(@Param("id", ParseIntPipe) id: number) {
        return this.ticketService.remove(id);
    }
}