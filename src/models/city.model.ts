import { Entity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { State } from "./state.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "cities" })
export class City extends BaseEntity {
    @Property({ unique: true })
    name!: string

    @ManyToOne(() => State, { unique: true })
    state!: Rel<State>
}
