import { Entity, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { City } from "./city.model";
import { User } from "./user.model";
import { BaseEntity } from "./base.entity";
import { ApiProperty } from "@nestjs/swagger";



@Entity({ tableName: "addresses" })
export class Address extends BaseEntity {
    @ApiProperty({ description: "postal_code" })
    @Property()
    postal_code!: string

    @ApiProperty({ description: "address" })
    @Property({ type: 'text' })
    street!: string

    @ApiProperty({ description: "city", type: City })
    @OneToOne(() => City, { owner: true, unique: false })
    city!: Rel<City>

    @ManyToOne(() => User)
    user: Rel<User>
}
