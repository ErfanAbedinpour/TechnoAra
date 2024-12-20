import { Collection, Entity, ManyToMany, OneToMany, Property } from "@mikro-orm/core";
import { ProductAttribute } from "./product-attribute.model";
import { BaseEntity } from "./base.entity";



@Entity({ tableName: "attribute" })
export class Attribute extends BaseEntity {
    @Property({ unique: true })
    name!: string

    @OneToMany(() => ProductAttribute, product => product.attribute,)
    products = new Collection<ProductAttribute>(this)
}