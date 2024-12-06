import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import { Product } from "./product.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "comments" })
export class Comment extends BaseEntity {
    @Property({ type: 'text' })
    body: string

    @ManyToOne(() => User, { fieldName: "user_id" })
    user!: Rel<User>

    @ManyToOne(() => Product, { fieldName: "product_id", deleteRule: "set null" })
    product!: Rel<Product>
}


export enum EntityType {
    ARTICLES = "articles",
    PRODUCT = "product"
}