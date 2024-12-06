import { BaseEntity, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { Cart } from "./cart.model";
import { Product } from "./product.model";


@Entity({ tableName: "cart_product" })
export class CartProduct extends BaseEntity {
    @ManyToOne(() => Cart, { fieldName: "cart_id" })
    cart!: Rel<Cart>

    @ManyToOne(() => Product, { fieldName: "product_id" })
    product!: Rel<Product>

    @Property()
    count!: number
}