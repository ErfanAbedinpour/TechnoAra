import { Entity, OneToOne, Property, Rel } from "@mikro-orm/core";
import { User } from "./user.model";
import Decimal from "decimal.js";
import { BaseEntity } from "./base.entity";

@Entity({ tableName: "wallets" })
export class Wallet extends BaseEntity {
    @OneToOne(() => User, { fieldName: "user_id", nullable: false })
    user: Rel<User>
    @Property({ columnType: "numeric(10,2)", type: () => Decimal, default: 0 })
    credit: Decimal
}