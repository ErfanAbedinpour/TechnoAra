import { BaseEntity, Entity, OneToOne, Property, Rel } from "@mikro-orm/core";

@Entity({ tableName: 'profiles' })
export class Profile extends BaseEntity {

    @Property()
    bio: string

    @Property()
    profile: string
}

