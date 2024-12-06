import { Entity, OneToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: 'profiles' })
export class Profile extends BaseEntity {
    @Property()
    bio: string

    @Property()
    profile: string
}

