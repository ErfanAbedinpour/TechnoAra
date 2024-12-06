import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "categoryies" })
export class Category extends BaseEntity {
    @Property({ unique: true, length: 50 })
    slug!: string

    @Property()
    title!: string

    @Property({ default: true })
    isActivate: boolean

    @ManyToOne(() => User, { fieldName: "user_id" })
    user: Rel<User>

    @Property()
    en_name: string

}