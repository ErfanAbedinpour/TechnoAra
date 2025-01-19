import { Entity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { City } from "./city.model";
import { User } from "./user.model";
import { BaseEntity } from "./base.entity";



@Entity({ tableName: "addresses" })
export class Address extends BaseEntity {
    @Property()
    postal_code!: string

    @Property({ type: 'text' })
    street!: string

    @OneToOne(() => City, { owner: true, unique: false })
    city!: Rel<City>

    @ManyToOne(() => User)
    user: Rel<User>
}
