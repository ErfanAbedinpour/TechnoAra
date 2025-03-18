import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { TicketService } from './ticket.service';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
} from '@nestjs/swagger';
import { TicketDto } from './dto/ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { HttpExceptionDto } from '../../dtos/http-exception.dto';

// ticket
@Controller('tickets')
@ApiBearerAuth("JWT_AUTH")
export class TicketController {
    constructor(private readonly ticketService: TicketService) { }
    // create Ticket Dto
    @Post()
    @ApiCreatedResponse({
        description: 'ticket created successfully',
        type: TicketDto,
    })
    @ApiBody({ type: CreateTicketDto })
    create(@Body() ticketDto: CreateTicketDto, @GetUser('id') userId: number): Promise<TicketDto> {
        return this.ticketService.create(ticketDto, userId);
    }

    // findOne
    @Get(':id')
    @ApiParam({ name: 'id', description: "ticket identifier" })
    @ApiOkResponse({ description: 'get ticket successfully', type: TicketDto })
    @ApiNotFoundResponse({ description: 'ticket not found', type: HttpExceptionDto })
    findOne(@Param('id', ParseUUIDPipe) identify: string, @GetUser("id") userId: number) {
        return this.ticketService.getUserTicketById(identify, userId);
    }

    // findAll
    @Get()
    @ApiOkResponse({ description: 'Tickets fetched Successfully', type: [TicketDto] })
    findAll(@GetUser("id") userId: number) {
        return this.ticketService.getAllUserTicket(userId);
    }

    // update
    @Patch(':id')
    @ApiParam({ name: "id", description: "ticket identifier(uuid)" })
    @ApiBody({ type: UpdateTicketDto })
    @ApiOkResponse({ description: 'tickets updated successfully', type: TicketDto })
    @ApiNotFoundResponse({ description: 'ticket not found', type: HttpExceptionDto })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateTicketDto: UpdateTicketDto,
        @GetUser('id') userId: number,
    ) {
        return this.ticketService.update(updateTicketDto, id, userId);
    }

    // remove
    @Delete(':id')
    @ApiParam({ name: "id", description: "ticket identifier(uuid)" })
    @ApiOkResponse({ description: 'ticket remove successfully', type: TicketDto })
    @ApiNotFoundResponse({ description: 'ticket not found', type: HttpExceptionDto })
    delete(@Param('id', ParseUUIDPipe) id: string, @GetUser('id') userId: number) {
        return this.ticketService.remove(id, userId);
    }
}
