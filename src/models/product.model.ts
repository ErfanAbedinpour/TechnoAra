import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import Decimal from "decimal.js";
import { Category } from "./category.model";
import { Cart } from "./cart.model";
import { CartProduct } from "./cart-product.model";
import { Order } from "./order.model";
import { OrderItem } from "./order-item.model";
import { ProductAttribute } from "./product-attribute.model";
import { BaseEntity } from "./base.entity";
import { Comment } from "./comment.model";
import { Brand } from "./brand.model";
import { ProductImage } from "./product-image";


@Entity({ tableName: "products" })
export class Product extends BaseEntity {
    @Property({ length: 50 })
    title!: string

    @Property({ unique: true })
    slug!: string

    @Property()
    inventory!: number

    @Property({ type: "text" })
    description!: string

    @ManyToOne(() => User, { fieldName: "user_id", nullable: false, deleteRule: "set null" })
    user!: Rel<User>

    @Property({ type: 'decimal', columnType: 'numeric(10,2)', nullable: false })
    price!: Decimal

    @ManyToOne(() => Category, { fieldName: "category_id", nullable: false, deleteRule: "set null" })
    category!: Rel<Category>

    @ManyToMany(() => Cart, cart => cart.products, { pivotEntity: () => CartProduct, owner: true })
    carts = new Collection<Cart>(this)

    @ManyToMany(() => Order, order => order.products, { pivotEntity: () => OrderItem })
    orders = new Collection<Order>(this)

    @OneToMany(() => ProductAttribute, attr => attr.product)
    attributes = new Collection<ProductAttribute>(this)

    @OneToMany(() => Comment, comment => comment.product)
    comments = new Collection<Comment>(this)

    @ManyToOne(() => Brand, { fieldName: "brand_id", nullable: true, deleteRule: "set null" })
    brand: Rel<Brand>

    @OneToMany(() => ProductImage, pi => pi.product)
    products = new Collection<ProductImage>(this)
}