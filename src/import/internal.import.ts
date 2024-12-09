import { AuthModule } from "src/modules/auth/auth.module";
import { ReidsModule } from "../modules/redis/redis.module";

export const internalImports = [AuthModule, ReidsModule];