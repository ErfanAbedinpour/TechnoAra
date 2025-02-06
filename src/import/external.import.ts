import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ConfigModule } from "@nestjs/config";
import databaseConfig from "src/config/database.config";
import config from '../mikro-orm.config'



export const externalImports = [
    ConfigModule.forRoot({ cache: true, isGlobal: true, load: [databaseConfig] }),
    MikroOrmModule.forRoot(config),
]