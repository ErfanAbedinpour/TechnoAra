import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import Decimal from "decimal.js";
import { Product } from "./product.model";
import { Order } from "./order.model";

@Entity({ tableName: "order-items" })
export class OrderItem {
    @ManyToOne(() => Product, { primary: true, fieldName: "product_id" })
    product: Rel<Product>

    @ManyToOne(() => Order, { primary: true, fieldName: "order_id" })
    order: Rel<Order>

    @Property()
    quantity: number

    @Property({ type: 'decimal', columnType: "numeric(10,2)" })
    price: Decimal
}