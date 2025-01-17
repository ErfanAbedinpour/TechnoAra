import { Entity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { Province } from "./province.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "cities" })
export class City extends BaseEntity {
    @Property({ unique: true })
    title!: string

    @Property({ unique: true })
    slug: string

    @Property()
    en_name: string

    @Property()
    latitude: string
    @Property()
    longitude: string

    @ManyToOne(() => Province, { unique: true })
    province!: Rel<Province>
}
