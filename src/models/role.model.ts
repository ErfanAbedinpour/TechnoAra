import { Entity, Enum } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";




@Entity({ tableName: "role" })
export class Role extends BaseEntity {
    @Enum({ items: () => UserRole, unique: true })
    name!: UserRole
}


export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}