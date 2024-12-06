import { Collection, Entity, ManyToMany, OneToOne, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import { Product } from "./product.model";
import { CartProduct } from "./cart-product.model";
import { BaseEntity } from "./base.entity";


@Entity({ tableName: "carts" })
export class Cart extends BaseEntity {
    @OneToOne(() => User, { fieldName: "User_id", owner: true })
    user: Rel<User>

    @ManyToMany(() => Product, product => product.carts, { pivotEntity: () => CartProduct })
    products = new Collection<Product>(this)
}