import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ abstract: true })
export abstract class BaseEntity {
    @PrimaryKey()
    id!: number

    @Property({ columnType: 'bigint', type: 'bigint' })
    createdAt = Date.now()

    @Property({ columnType: 'bigint', type: "bigint", onUpdate: () => Date.now() })
    updatedAt = Date.now()
}