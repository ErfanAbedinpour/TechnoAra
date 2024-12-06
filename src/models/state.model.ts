import { BaseEntity, Collection, Entity, OneToMany, Property, Rel } from "@mikro-orm/core";
import { City } from "./city.model";

@Entity({ tableName: "states" })
export class State extends BaseEntity {
    @Property({ unique: true })
    name!: string

    @OneToMany(() => City, city => city.state)
    cities = new Collection<City>(this)
}
