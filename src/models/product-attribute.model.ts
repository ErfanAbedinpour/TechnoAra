import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { Product } from "./product.model";
import { Attribute } from "./attribute.model";



@Entity({ tableName: "productAttributes" })
export class ProductAttribute {
    @ManyToOne(() => Product, { primary: true, fieldName: "product_id", deleteRule: 'cascade' })
    product!: Rel<Product>

    @ManyToOne(() => Attribute, { primary: true, fieldName: "attribute_id", deleteRule: 'cascade' })
    attribute!: Rel<Attribute>

    @Property()
    value!: string
}