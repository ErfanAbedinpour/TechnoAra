import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Logger, ValueProvider } from "@nestjs/common";
import { ConfigModule, ConfigService, ConfigType } from "@nestjs/config";
import databaseConfig from "src/config/database.config";

const QueryLogger: ValueProvider = {
    provide: "QueryLogger",
    useValue: new Logger("mikro-orm")
}


export const externalImports = [
    ConfigModule.forRoot({ cache: true, load: [databaseConfig] }),
    MikroOrmModule.forRootAsync({
        providers: [QueryLogger],
        inject: [databaseConfig.KEY, QueryLogger.provide],
        imports: [ConfigModule.forFeature(databaseConfig)],

        useFactory(config: ConfigType<typeof databaseConfig>, logger: Logger) {
            const { host, name, password, port, user } = config;
            const DB_URI = `postgres://${user}:${password}@${host}`
            return {
                clientUrl: DB_URI,
                entities: ['./dist/models'],
                entitiesTs: ['$./src/models'],
                port: port,
                dbName: name,
                debug: true,
                baseDir: process.cwd(),
                autoLoadEntities: true,
                driver: PostgreSqlDriver,
                logger: (msg) => logger.debug(msg),
            }
        },
    }),
]