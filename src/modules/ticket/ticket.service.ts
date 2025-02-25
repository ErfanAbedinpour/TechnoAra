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
    Loaded,
    NotFoundError,
    wrap,
} from '@mikro-orm/postgresql';
import { Ticket } from '../../models/ticket.model';
import { v4 } from 'uuid';
import { ErrorMessages } from '../../errorResponse/err.response';
import { UpdateTicketDto } from './dto/update-ticket.dto';

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

    private async findById(id: number) {
        try {
            const ticket = await this.em.findOneOrFail(Ticket, id);
            return ticket;
        } catch (err) {
            this.mikroOrmErrorHandler(err);
        }
    }

    async create({ body, department, title }: CreateTicketDto, userId: number) {
        const id = v4();
        const ticket = this.em.create(
            Ticket,
            { body, department, title, identify: id, user: userId },
            { persist: true },
        );

        try {
            await this.em.flush();
            return ticket;
        } catch (e) {
            this.mikroOrmErrorHandler(e);
            this.logger.error(e);
            throw new InternalServerErrorException(ErrorMessages.UNKNOWN_ERROR);
        }
    }

    async getById(id: number): Promise<Loaded<Ticket, 'user', '*', never>> {
        try {
            const ticket = await this.em.findOneOrFail(Ticket, id, {
                populate: ['user'],
            });
            return ticket;
        } catch (err) {
            this.mikroOrmErrorHandler(err);
            throw new InternalServerErrorException(ErrorMessages.UNKNOWN_ERROR);
        }
    }

    async getAll() {
        const tickets = await this.em.find(Ticket, {}, { populate: ['user'] });
        return tickets;
    }

    async remove(id: number, userId: number) {
        try {
            const ticket = await this.em.findOneOrFail(Ticket, { user: userId, id });
            await this.em.removeAndFlush(ticket);
            return ticket;
        } catch (err) {
            this.mikroOrmErrorHandler(err);
            this.logger.error(err);
            throw new InternalServerErrorException(ErrorMessages.UNKNOWN_ERROR);
        }
    }

    async update(updateDto: UpdateTicketDto, id: number, userId: number) {
        try {
            const ticket = await this.em.findOneOrFail(Ticket, { user: userId, id });

            const newTicket = wrap(ticket).assign(updateDto);
            await this.em.flush();
            return newTicket;
        } catch (err) {
            this.mikroOrmErrorHandler(err);
        }
    }

    // get userTickets
    getAllUserTicket(userId: number): Promise<Ticket[]> {
        return this.em.find(Ticket, { user: userId });
    }
    // getUserTicket
    async getUserTicket(userId: number, ticketId: number): Promise<Ticket> {
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
