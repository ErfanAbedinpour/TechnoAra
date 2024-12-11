import { Loaded } from "@mikro-orm/core";
import { User } from "../../../models/user.model";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllUserResponse {
    @ApiProperty()
    users: Loaded<User, never, "*", never>[]
    @ApiProperty()
    meta: {
        page: number,
        count: number,
        countAll: number,
        allPages: number
    }
}


export class GetOneUserResponse {
    @ApiProperty()
    user: Loaded<User, "*", "*", never>
}