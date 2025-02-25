import { Entity, Enum, ManyToOne, Property, Rel } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.model';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
// enums
export enum TicketStatus {
    OPEN = 'open',
    CLOSE = 'closed',
    IN_PROGRESS = 'In Progress',
}

export enum TicketDepartment {
    finance = 'finance',
    support = 'support',
    sales = 'sales',
}

@Entity({ tableName: 'tickets' })
export class Ticket extends BaseEntity {
    @ApiProperty()
    @Property({ nullable: false })
    title!: string;

    @ApiProperty()
    @Property({ type: 'text', nullable: false })
    body!: string;

    @ApiProperty({ enum: TicketStatus })
    @Enum({ items: () => TicketStatus, nullable: false })
    status = TicketStatus.OPEN;

    @ApiProperty({ enum: TicketDepartment })
    @Enum({ items: () => TicketDepartment, nullable: false })
    department!: TicketDepartment;

    @ApiProperty({ description: 'ticket uuid' })
    @Property({ type: 'uuid', unique: true, nullable: false })
    identify = v4();

    @ManyToOne(() => User, {
        nullable: false,
        deleteRule: 'set null',
        updateRule: 'cascade',
    })
    user!: Rel<User>;
}
