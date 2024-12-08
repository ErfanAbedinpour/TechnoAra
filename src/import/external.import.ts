import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Logger, ValueProvider } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import databaseConfig from "src/config/database.config";
import config from '../mikro-orm.config'

const QueryLogger: ValueProvider = {
    provide: "QueryLogger",
    useValue: new Logger("mikro-orm")
}


export const externalImports = [
    ConfigModule.forRoot({ cache: true, isGlobal: true, load: [databaseConfig] }),
    MikroOrmModule.forRoot(config),
]