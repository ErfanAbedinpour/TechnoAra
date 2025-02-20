import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { EntityManager } from "@mikro-orm/postgresql";
import { Ticket } from "../../models/ticket.model";
import { v4 } from "uuid";
import { ErrorMessages } from "../../errorResponse/err.response";

@Injectable()

export class TicketService {
    private readonly logger = new Logger(TicketService.name)

    constructor(private readonly em: EntityManager) { }

    async create({ body, department, title }: CreateTicketDto, userId: number) {

        const id = v4();
        const ticket = this.em.create(Ticket, { body, department, title, identify: id, user: userId }, { persist: true });

        try {
            await this.em.flush();
            return ticket
        } catch (e) {
            this.logger.error(e)
            throw new InternalServerErrorException(ErrorMessages.UNKNOWN_ERROR)
        }
    }
}