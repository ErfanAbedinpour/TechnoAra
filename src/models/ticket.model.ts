import {
    Entity,
    Enum,
    ManyToOne,
    Property,
    Rel,
} from "@mikro-orm/core";
import { v4 } from "uuid";
import { User } from "./user.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "tickets" })
export class Ticket extends BaseEntity {
    @Property({ nullable: false })
    title!: string;

    @Property({ type: "text", nullable: false })
    body!: string;

    @Enum({ items: () => TicketStatus, nullable: false })
    status = TicketStatus.OPEN;

    @Enum({ items: () => TicketDepartment, nullable: false })
    department!: TicketDepartment;

    @Property({ type: "uuid", unique: true, nullable: false })
    identify = v4();

    @ManyToOne(() => User, { nullable: false, deleteRule: "set null", updateRule: "cascade" })
    user!: Rel<User>;
}

export enum TicketStatus {
    OPEN = "open",
    CLOSE = "closed",
    IN_PROGRESS = "In Progress",
}

export enum TicketDepartment {
    finance = "finance",
    support = "support",
    sales = "sales",
}
