import { AuthModule } from "src/modules/auth/auth.module";
import { ReidsModule } from "../modules/redis/redis.module";
import { UserModule } from "../modules/user/user.module";
import { ProductModule } from "../modules/product/product.module";
import { CategoryModule } from "../modules/category/category.module";

export const internalImports = [AuthModule, ReidsModule, UserModule, ProductModule, CategoryModule];