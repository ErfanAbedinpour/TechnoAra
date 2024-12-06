import { Entity, Enum, ManyToMany, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { v4 } from 'uuid'
import { User } from "./user.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: 'tickets' })
export class Ticket extends BaseEntity {
    @Property()
    title!: string

    @Property({ type: 'text' })
    body!: string

    @Enum({ items: () => TicketStatus })
    status = TicketStatus.OPEN

    @Enum(() => TicketDepartment)
    department!: TicketDepartment

    @Property({ type: 'uuid', unique: true })
    identify = v4()

    @ManyToOne(() => User)
    user!: Rel<User>
}



export enum TicketStatus {
    OPEN = 'open',
    CLOSE = "closed",
    IN_PROGRESS = "In Progress"
}


export enum TicketDepartment {
    finance = "finance",
    support = "support",
    sales = "sales"
}