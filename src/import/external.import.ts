import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ConfigModule, ConfigType } from "@nestjs/config";
import databaseConfig from "src/config/database.config";
import config from '../mikro-orm.config'
import { BullModule } from "@nestjs/bullmq";
import redisConfig from "../config/redis.config";



export const externalImports = [
    ConfigModule.forRoot({ cache: true, isGlobal: true, load: [databaseConfig, redisConfig] }),
    MikroOrmModule.forRoot(config),
    BullModule.forRootAsync({
        inject: [redisConfig.KEY],
        useFactory: (config: ConfigType<typeof redisConfig>) => {
            return {
                connection: {
                    host: config.host,
                    port: +config.port
                }
            }
        }
    })
]