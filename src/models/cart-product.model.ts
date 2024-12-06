import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { Cart } from "./cart.model";
import { Product } from "./product.model";


@Entity({ tableName: "cart_product" })
export class CartProduct {
    @ManyToOne(() => Cart, { fieldName: "cart_id", primary: true })
    cart!: Rel<Cart>

    @ManyToOne(() => Product, { fieldName: "product_id", primary: true })
    product!: Rel<Product>

    @Property()
    count!: number
}