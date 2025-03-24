import { Collection, Entity, Enum, ManyToMany, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import { Product } from "./product.model";
import { OrderItem } from "./order-item.model";
import { BaseEntity } from "./base.entity";
import { Address } from "./address.model";
import Decimal from "decimal.js";

export enum OrderStatus {
    Processing = 'processing',
    Complete = "complete",
    Cancelled = "cancelled",
}

@Entity({ tableName: "orders" })
export class Order extends BaseEntity {
    @Enum({ items: () => OrderStatus, default: OrderStatus.Processing, nullable: false })
    status = OrderStatus.Processing

    @ManyToOne(() => User, { deleteRule: "set null" })
    user: Rel<User>

    @Property({ type: "uuid", nullable: false })
    order_number: string

    @Property({ type: "date", nullable: false })
    delivered_at: Date

    @OneToOne(() => Address, { nullable: false })
    address: Address

    @ManyToMany(() => Product, product => product.orders, { pivotEntity: () => OrderItem, owner: true, nullable: false })
    products = new Collection<Product>(this)

    @Property({ type: 'decimal', nullable: false })
    total_price: Decimal
}
