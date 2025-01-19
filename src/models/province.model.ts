import { Collection, Entity, OneToMany, Property, Rel } from "@mikro-orm/core";
import { City } from "./city.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "province" })
export class Province extends BaseEntity {
    @Property()
    title!: string
    @Property()
    en_name: string
    @Property({ unique: true })
    slug: string

    @Property()
    latitude: string

    @Property()
    longitude: string

    @OneToMany(() => City, city => city.province)
    cities = new Collection<City>(this)
}
