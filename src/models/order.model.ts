import { Collection, Entity, Enum, ManyToMany, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import { Product } from "./product.model";
import { OrderItem } from "./order-item.model";
import { BaseEntity } from "./base.entity";


@Entity({ tableName: "orders" })
export class Order extends BaseEntity {
    @Enum({ items: () => OrderStatus })
    status = OrderStatus.Processing

    @ManyToOne(() => User, { deleteRule: "set null" })
    user: Rel<User>

    @ManyToMany(() => Product, product => product.orders, { pivotEntity: () => OrderItem, owner: true, nullable: false })
    products = new Collection<Product>(this)

}



export enum OrderStatus {
    Processing = 'processing',
    Complete = "complete",
    Cancelled = "cancelled",
}