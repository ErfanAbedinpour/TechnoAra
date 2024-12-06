import { BaseEntity, Entity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { State } from "./state.model";

@Entity({ tableName: "cities" })
export class City extends BaseEntity {
    @Property({ unique: true })
    name!: string

    @ManyToOne(() => State, { unique: true })
    state!: Rel<State>
}
