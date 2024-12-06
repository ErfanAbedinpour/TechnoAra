import { Cascade, Collection, Entity, ManyToOne, OneToMany, OneToOne, Property, Rel } from "@mikro-orm/core";
import { Role, UserRole } from "./role.model";
import { Profile } from "./profile.model";
import { Product } from "./product.model";
import { Ticket } from "./ticket.model";
import { Address } from "./address.model";
import { Order } from "./order.model";
import { BaseEntity } from "./base.entity";




@Entity({ tableName: "users" })
export class User extends BaseEntity {

    @Property({ unique: true, nullable: false })
    email!: string

    @Property()
    username!: string

    @Property({ hidden: true, lazy: true, nullable: false })
    password!: string

    @OneToOne({ entity: () => Role, ref: true, default: UserRole.USER, nullable: false, fieldName: "role_id", owner: true, deleteRule: "set default" })
    role: Rel<Role>


    @OneToOne(() => Profile, { fieldName: "profile_id", owner: true, deleteRule: "cascade", updateRule: 'cascade' })
    profile: Rel<Profile>

    @OneToMany(() => Product, (product) => product.user)
    products = new Collection<Product>(this)

    @OneToMany(() => Ticket, ticket => ticket.user, { cascade: [Cascade.REMOVE] })
    tickets = new Collection<Ticket>(this)


    @OneToMany(() => Address, address => address.user)
    addresses = new Collection<Address>(this)

    @OneToMany(() => Order, order => order.user)
    orders = new Collection<Order>(this)
}