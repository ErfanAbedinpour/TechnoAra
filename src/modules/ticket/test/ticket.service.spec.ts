import { Test } from '@nestjs/testing';
import { TicketService } from '../ticket.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DB_TEST_CONFIG } from '../../../config/db.test.config';
import { EntityManager } from '@mikro-orm/postgresql';
import {
    Ticket,
    TicketDepartment,
    TicketStatus,
} from '../../../models/ticket.model';
import { User } from '../../../models/user.model';
import { Role, UserRole } from '../../../models/role.model';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ErrorMessages } from '../../../errorResponse/err.response';
import { v4 } from 'uuid';
import { UpdateTicketDto } from '../dto/update-ticket.dto';
import { ChangeStatusDto } from '../dto/change-status.dto';
import { spec } from 'node:test/reporters';

describe('Ticket Service', () => {
    let service: TicketService;
    let em: EntityManager;
    let user: User;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [MikroOrmModule.forRoot(DB_TEST_CONFIG)],
            providers: [TicketService],
        }).compile();
        em = moduleRef.get(EntityManager);
        service = moduleRef.get(TicketService);

        const role = em.create(Role, { name: UserRole.ADMIN }, { persist: true });
        user = em.create(
            User,
            {
                role,
                username: 'fake-username',
                email: 'fake-email',
                password: 'fake-pass',
                phone: 'fake-phone',
            },
            { persist: true },
        );
        await em.flush();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
        expect(em).toBeDefined();
    });

    describe('Create new Ticket', () => {
        it('should be created ticket', async () => {
            const ticketDto: CreateTicketDto = {
                body: 'this is test body',
                department: TicketDepartment.sales,
                title: 'problem in sales',
            };

            const result = await service.create(ticketDto, user.id);
            expect(result).toBeTruthy();
            expect(result.id).toStrictEqual(1);
            expect(result.body).toStrictEqual(ticketDto.body);
            expect(result.user.id).toStrictEqual(user.id);
        });

        it('should be thorw Error If User Not exsist', async () => {
            const ticketDto: CreateTicketDto = {
                body: 'this is test body',
                department: TicketDepartment.sales,
                title: 'problem in sales',
            };

            const promise = service.create(ticketDto, 2);
            expect(promise).rejects.toThrow(BadRequestException);
            expect(promise).rejects.toThrow(ErrorMessages.USER_NOT_FOUND);
        });
    });

    describe('Get Ticket By Id', () => {
        it('should be return ticket By Id', async () => {
            const ticket = await service.create(
                {
                    body: 'fake ticket 1',
                    department: TicketDepartment.sales,
                    title: 'test title',
                },
                user.id,
            );

            const result = await service.getById(ticket.id);
            expect(result.id).toStrictEqual(ticket.id);
            expect(result.user.id).toStrictEqual(user.id);
            expect(result.status).toStrictEqual(TicketStatus.OPEN);
        });

        it('should be throw NotFound', () => {
            const promise = service.getById(233);
            expect(promise).rejects.toThrow(NotFoundException);
            expect(promise).rejects.toThrow(ErrorMessages.TICKET_NOT_FOUND);
        });
    });

    describe('get Ticket List', () => {
        beforeEach(async () => {
            for (let i = 1; i <= 10; i++) {
                em.create(
                    Ticket,
                    {
                        body: `test-body-${i}`,
                        department: TicketDepartment.support,
                        title: `test-title-${i}`,
                        user: user.id,
                        identify: v4(),
                    },
                    { persist: true },
                );
            }
            await em.flush();
        });

        it('should be returned list of tickets', async () => {
            const tickets = await service.getAll();
            expect(tickets.length).toStrictEqual(10);
            for (let i = 0; i < tickets.length; i++) {
                const ticket = tickets[i];
                expect(ticket.user.id).toStrictEqual(user.id);
                expect(ticket.title).toStrictEqual(`test-title-${i + 1}`);
            }
        });
    });

    describe('remove Tickets', () => {
        let ticket: Ticket;
        beforeEach(async () => {
            ticket = em.create(
                Ticket,
                {
                    body: `test-body-1`,
                    department: TicketDepartment.support,
                    title: `test-title-1`,
                    user: user.id,
                    identify: v4(),
                },
                { persist: true },
            );
            await em.flush();
        });

        it('should be throw NotFound if the ticket is not found', () => {
            const remPromise = service.remove(122, user.id);
            expect(remPromise).rejects.toThrow(NotFoundException);
            expect(remPromise).rejects.toThrow(ErrorMessages.TICKET_NOT_FOUND);
        });

        it('should be remove ticket', async () => {
            const result = await service.remove(ticket.id, ticket.user.id);
            expect(result).toBeTruthy();
            expect(result.id).toStrictEqual(ticket.id);
        });
    });
    describe('update Tickets', () => {
        let ticket: Ticket;

        const updatedPayload: UpdateTicketDto = {
            status: TicketStatus.CLOSE,
        };
        beforeEach(async () => {
            ticket = em.create(
                Ticket,
                {
                    body: `test-body-1`,
                    department: TicketDepartment.support,
                    title: `test-title-1`,
                    user: user.id,
                    identify: v4(),
                },
                { persist: true },
            );
            await em.flush();
        });

        it('should be throw NotFound if the ticket is not found', () => {
            const remPromise = service.update(updatedPayload, 5, user.id);
            expect(remPromise).rejects.toThrow(NotFoundException);
            expect(remPromise).rejects.toThrow(ErrorMessages.TICKET_NOT_FOUND);
        });

        it('should be remove ticket', async () => {
            const result = await service.update(updatedPayload, ticket.id, user.id);
            expect(result).toBeTruthy();
            expect(result.id).toStrictEqual(ticket.id);
            const isTicketUpdated = await em.findOne(Ticket, ticket.id);
            expect(isTicketUpdated.status).toStrictEqual(TicketStatus.CLOSE);
        });

        describe('Change Ticket Staus', () => {
            let ticket: Ticket;

            const updatedPayload: ChangeStatusDto = {
                status: TicketStatus.CLOSE,
            };
            beforeEach(async () => {
                ticket = em.create(
                    Ticket,
                    {
                        body: `test-body-1`,
                        department: TicketDepartment.support,
                        title: `test-title-1`,
                        user: user.id,
                        identify: v4(),
                    },
                    { persist: true },
                );
                await em.flush();
            });

            it('should ticket staus to be open', () => {
                expect(ticket.status).toEqual(TicketStatus.OPEN);
            });
            it('should be change ticket staus', async () => {
                const promise = service.changeStatus(ticket.id, updatedPayload);
                expect(promise).resolves.toBeTruthy();
                expect(await promise).toBeInstanceOf(Ticket);
                const newTicket = await em.findOne(Ticket, ticket.id);
                expect(newTicket.status).toEqual(TicketStatus.CLOSE);
            });
        });
    });
});
