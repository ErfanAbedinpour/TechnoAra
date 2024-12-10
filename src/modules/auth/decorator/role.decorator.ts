import { SetMetadata } from "@nestjs/common"
import { UserRole } from "../../../models/role.model"

export const ROLE_KEY = "role"

export const Role = (...role: UserRole[]) => SetMetadata(ROLE_KEY, role)