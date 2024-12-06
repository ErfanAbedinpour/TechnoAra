import { Entity, OneToOne, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import Decimal from "decimal.js";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "wallets" })
export class Wallet extends BaseEntity {

    @OneToOne({ entity: () => User, fieldName: "user_id", owner: true })
    user!: Rel<User>

    @Property({ columnType: "numeric(10,2)", type: () => Decimal })
    credit: Decimal
}