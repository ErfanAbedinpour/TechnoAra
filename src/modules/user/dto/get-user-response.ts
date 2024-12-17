import { Loaded } from "@mikro-orm/core";
import { User } from "../../../models/user.model";
import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";


export class Meta {
    @ApiProperty()
    page: number;

    @ApiProperty()
    count: number;

    @ApiProperty()
    countAll: number;

    @ApiProperty()
    allPages: number
}
export class GetAllUserResponse {
    @ApiProperty({ type: [UserDto] })
    users: Loaded<User, never, "*", never>[]
    @ApiProperty({ type: () => Meta })
    meta: Meta
}


export class GetOneUserResponse {
    @ApiProperty({ type: UserDto })
    user: User
}