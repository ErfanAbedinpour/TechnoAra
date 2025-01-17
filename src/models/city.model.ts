import { Entity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { State } from "./province.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "cities" })
export class City extends BaseEntity {
    @Property({ unique: true })
    title!: string

    @Property({ unique: true })
    slug: string

    @Property()
    latitude: string
    @Property()
    longitude: string

    @ManyToOne(() => State, { unique: true })
    province!: Rel<State>
}
