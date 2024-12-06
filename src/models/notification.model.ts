import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { User } from "./user.model";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "notifications" })
export class Notification extends BaseEntity {
    @Property()
    title: string;

    @Property({ type: 'text' })
    text: string

    @ManyToMany(() => User, user => user.notifications, { owner: true })
    users = new Collection<User>(this)
}