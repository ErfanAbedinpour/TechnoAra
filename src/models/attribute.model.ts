import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { Product } from "./product.model";
import { ProductAttribute } from "./product-attribute.model";
import { BaseEntity } from "./base.entity";



@Entity({ tableName: "attribute" })
export class Attribute extends BaseEntity {
    @Property({ unique: true })
    name!: string

    @ManyToMany(() => Product, product => product.attributes, { pivotEntity: () => ProductAttribute, owner: true })
    products = new Collection<Product>(this)
}