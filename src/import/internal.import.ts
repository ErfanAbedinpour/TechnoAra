import { AuthModule } from "src/modules/auth/auth.module";
import { ReidsModule } from "../modules/redis/redis.module";
import { UserModule } from "../user/user.module";

export const internalImports = [AuthModule, ReidsModule, UserModule];