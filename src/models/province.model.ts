import { Collection, Entity, OneToMany, Property, Rel } from "@mikro-orm/core";
import { City } from "./city.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "province" })
export class State extends BaseEntity {
    @Property()
    title!: string

    @Property({ unique: true })
    slug: string

    @Property()
    latitude: number

    @Property()
    longitude: number

    @OneToMany(() => City, city => city.province)
    cities = new Collection<City>(this)
}
