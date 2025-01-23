import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { Product } from "./product.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "productImages" })
export class ProductImage extends BaseEntity {
    @Property({ default: false })
    isTitle: boolean;

    @Property({ fieldName: "src", nullable: false })
    src: string

    @ManyToOne(() => Product, { fieldName: "product_id", deleteRule: "cascade", updateRule: "cascade" })
    product: Rel<Product>
}