import { UserRole } from "../../../models/role.model";

export class CreateUserDto {
    username: string;
    email: string;
    password: string;
    role: UserRole
}
