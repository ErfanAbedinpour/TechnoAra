import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "../../../models/user.model";
import { UserDto } from "./user.dto";

export class RemoveUserResponse {
    @ApiProperty()
    isRemoved: boolean;
    @ApiProperty({ type: () => PickType(UserDto, ["id", 'email', 'bio', 'phone', 'profile', 'role', 'wallet', 'username']) })
    user: User
}