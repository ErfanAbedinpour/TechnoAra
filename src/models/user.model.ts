import { BeforeCreate, Cascade, Collection, Entity, EventArgs, ManyToMany, OneToMany, OneToOne, Property, Rel } from "@mikro-orm/core";
import { Role } from "./role.model";
import { Product } from "./product.model";
import { Ticket } from "./ticket.model";
import { Address } from "./address.model";
import { Order } from "./order.model";
import { BaseEntity } from "./base.entity";
import { Notification } from "./notification.model";
import { Comment } from "./comment.model";
import { ArgonService } from "../modules/auth/hashingServices/argon.service";



@Entity({ tableName: "users" })
export class User extends BaseEntity {
    private hashService = new ArgonService()

    @Property({ unique: true, nullable: false })
    email!: string

    @Property()
    username!: string

    @Property({ hidden: true, lazy: true, nullable: false })
    password!: string

    @OneToOne({ entity: () => Role, nullable: false, fieldName: "role_id", owner: true, deleteRule: "set default", default: 2, unique: false })
    role: Rel<Role>
    @OneToMany(() => Product, (product) => product.user)
    products = new Collection<Product>(this)

    @OneToMany(() => Ticket, ticket => ticket.user, { cascade: [Cascade.REMOVE] })
    tickets = new Collection<Ticket>(this)

    @Property({ nullable: true })
    bio?: string

    @Property({ nullable: true })
    profile?: string

    @OneToMany(() => Address, address => address.user)
    addresses = new Collection<Address>(this)

    @OneToMany(() => Order, order => order.user)
    orders = new Collection<Order>(this)

    @ManyToMany(() => Notification, notification => notification.users)
    notifications = new Collection<Notification>(this)

    @OneToMany(() => Comment, comment => comment.user)
    comments = new Collection<Comment>(this)

    @BeforeCreate()
    async beforeCreate(args: EventArgs<this>) {
        args.entity.password = await this.hashService.hash(args.entity.password)
        args.entity.email = args.entity.email.toLowerCase();
        return args;
    }
}