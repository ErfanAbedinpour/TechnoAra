import { Entity, Enum, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import { User } from "./user.model";
import Decimal from "decimal.js";
import { Order } from "./order.model";
import { BaseEntity } from "./base.entity";



export enum PaymentStatus {
    PENDING = "Pending",
    SUCCESS = "Success",
    FAILED = "Failed"
}

export enum Providers {
    ZARINPAL = "zarinpal",
    ZIPAL = "zipal"
}

@Entity({ tableName: "payments" })
export class Payment extends BaseEntity {

    @Property({ type: 'decimal', columnType: 'numeric(10,2)', nullable: false })
    amount!: Decimal

    @Enum({ items: () => Providers, nullable: false })
    provider: Providers


    @Property({ nullable: false })
    authority: string

    @Enum({ items: () => PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus

    @Property({ nullable: true, })
    transactionId: string

    @ManyToOne(() => User, { deleteRule: "set null", updateRule: "cascade" })
    userId: User

    @OneToOne(() => Order, { owner: true })
    orderId!: Order;
}
