import { BaseEntity, Entity, Enum, Property } from "@mikro-orm/core";




@Entity({ tableName: "role" })
export class Role extends BaseEntity {
    @Enum({ items: () => UserRole, unique: true })
    name!: UserRole
}


export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}