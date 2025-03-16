import { Entity, ManyToOne, OneToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { Province } from "./province.model";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ tableName: "cities" })
export class City {
    @Property({ unique: true })
    title!: string

    @PrimaryKey()
    slug: string

    @Property()
    en_name: string

    @Property()
    @ApiProperty()
    latitude: string

    @Property()
    longitude: string

    @ManyToOne(() => Province, { primary: true })
    province!: Rel<Province>

}
