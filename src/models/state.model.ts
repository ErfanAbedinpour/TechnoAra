import { Collection, Entity, OneToMany, Property, Rel } from "@mikro-orm/core";
import { City } from "./city.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "states" })
export class State extends BaseEntity {
    @Property({ unique: true })
    name!: string

    @Property({ unique: true })
    en_name: string

    @OneToMany(() => City, city => city.state)
    cities = new Collection<City>(this)
}
