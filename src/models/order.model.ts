import { BaseEntity, Collection, Entity, Enum, ManyToMany, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import { Product } from "./product.model";
import Decimal from "decimal.js";




@Entity({ tableName: "orders" })
export class Order extends BaseEntity {
    @Enum({ items: () => OrderStatus })
    status = OrderStatus.Processing

    @ManyToOne(() => User, { deleteRule: "set null" })
    user: Rel<User>

    @ManyToMany(() => Product, product => product.orders, { owner: true, nullable: false })
    products = new Collection<Product>(this)

    @Property({ type: Decimal, columnType: "numeric(10,2)", nullable: false })
    titlaPrice!: Decimal
}



export enum OrderStatus {
    Processing = 'processing',
    Complete = "complete",
    Cancelled = "cancelled",
}

