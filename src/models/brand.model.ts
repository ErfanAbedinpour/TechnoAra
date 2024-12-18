import { Collection, Entity, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import { Product } from "./product.model";
import { BaseEntity } from "./base.entity";


@Entity({ tableName: "brands" })
export class Brand extends BaseEntity {
    @ManyToOne(() => User, { fieldName: "user_id", nullable: false })
    user: Rel<User>

    @Property({ nullable: false })
    name: string;

    @OneToMany(() => Product, product => product.brand)
    products = new Collection<Product>(this)
}