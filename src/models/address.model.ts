import { BaseEntity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { City } from "./city.model";
import { User } from "./user.model";



export class Address extends BaseEntity {

    @Property()
    postal_code!: string

    @Property({ type: 'text' })
    street!: string

    @OneToOne(() => City, { owner: true })
    city!: Rel<City>


    @ManyToOne(() => User)
    user: Rel<User>
}
