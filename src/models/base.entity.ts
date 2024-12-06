import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ abstract: true })
export abstract class BaseEntity {
    @PrimaryKey()
    id!: number

    @Property()
    createdAt = Date.now()

    @Property({ onUpdate: () => Date.now() })
    updatedAt = Date.now()
}