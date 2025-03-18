import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import {
    ConstraintViolationException,
    EntityManager,
    NotFoundError,
    wrap,
} from '@mikro-orm/postgresql';
import { Ticket } from '../../models/ticket.model';
import { v4 } from 'uuid';
import { ErrorMessages } from '../../errorResponse/err.response';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketDto } from './dto/ticket.dto';

@Injectable()
export class TicketService {
    private readonly logger = new Logger(TicketService.name);

    constructor(private readonly em: EntityManager) { }

    private mikroOrmErrorHandler(err: unknown) {
        if (err instanceof ConstraintViolationException)
            throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);

        if (err instanceof NotFoundError)
            throw new NotFoundException(ErrorMessages.TICKET_NOT_FOUND);
    }

    // getTicketBy Identifier
    async getTicketByIdentify(id: string) {
        try {
            const ticket = await this.em.findOneOrFail(Ticket, { identify: id });
            return ticket;
        } catch (err) {
            this.mikroOrmErrorHandler(err);
        }
    }


    // get userTicketById
    async getUserTicketById(identify: string, userId: number) {
        try {
            const ticket = await this.em.findOneOrFail(Ticket, { identify, user: userId }, { exclude: ["user", "updatedAt"] })
            return ticket
        } catch (err) {
            this.mikroOrmErrorHandler(err)
            throw new InternalServerErrorException()
        }
    }

    // create Ticket
    async create({ body, department, title }: CreateTicketDto, userId: number): Promise<TicketDto> {
        const id = v4();
        const ticket = this.em.create(
            Ticket,
            { body, department, title, identify: id, user: userId },
            { persist: true },
        );

        try {
            await this.em.flush();

            return {
                id: ticket.id,
                body: ticket.body,
                department: ticket.department,
                identify: ticket.identify,
                status: ticket.status,
                title: ticket.title,
                createdAt: ticket.createdAt
            };
        } catch (e) {
            this.mikroOrmErrorHandler(e);
            this.logger.error(e);
            throw new InternalServerErrorException(ErrorMessages.UNKNOWN_ERROR);
        }
    }

    // remove ticket
    async remove(id: string, userId: number) {
        try {
            const ticket = await this.em.findOneOrFail(Ticket, { user: userId, identify: id });
            await this.em.removeAndFlush(ticket);
            return ticket;
        } catch (err) {
            this.mikroOrmErrorHandler(err);
            this.logger.error(err);
            throw new InternalServerErrorException(ErrorMessages.UNKNOWN_ERROR);
        }
    }

    // update Ticket
    async update(updateDto: UpdateTicketDto, id: string, userId: number): Promise<TicketDto> {
        try {
            const ticket = await this.em.findOneOrFail(Ticket, { user: userId, identify: id });
            const newTicket = wrap(ticket).assign(updateDto);
            await this.em.flush();
            return newTicket
        } catch (err) {
            this.mikroOrmErrorHandler(err);
            this.logger.error(err)
            throw new InternalServerErrorException(err)
        }
    }

    // get userTickets
    getAllUserTicket(userId: number): Promise<TicketDto[]> {
        return this.em.find(Ticket, { user: userId }, { exclude: ["user", "updatedAt"] });
    }

    // getUserTicket
    async getUserTicket(userId: number, ticketId: number): Promise<TicketDto> {
        try {
            const ticket = await this.em.findOneOrFail(Ticket, {
                user: userId,
                id: ticketId,
            });

            return ticket;
        } catch (err) {
            this.mikroOrmErrorHandler(err);
            throw new InternalServerErrorException(ErrorMessages.UNKNOWN_ERROR);
        }
    }

}
