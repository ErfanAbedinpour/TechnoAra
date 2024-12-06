import { BaseEntity, Collection, Entity, ManyToMany, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import Decimal from "decimal.js";
import { Category } from "./category.model";
import { Cart } from "./cart.model";
import { CartProduct } from "./cart-product.model";


@Entity({ tableName: "products" })
export class Product extends BaseEntity {
    @Property({ length: 50 })
    title!: string
    @Property()
    inventory!: number

    @Property({ type: "text" })
    describtion!: string

    @ManyToOne(() => User, { fieldName: "user_id", nullable: false, deleteRule: "set null" })
    user!: Rel<User>

    @Property({ columnType: 'numeric(10,2)', type: () => Decimal, nullable: false })
    price!: Decimal

    @ManyToOne(() => Category, { fieldName: "category_id", nullable: false, deleteRule: "set null" })
    category!: Rel<Category>

    @ManyToMany(() => Cart, cart => cart.products, { pivotEntity: () => CartProduct, owner: true })
    carts = new Collection<Cart>(this)
}