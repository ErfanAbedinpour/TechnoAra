import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ConfigModule, ConfigType } from "@nestjs/config";
import databaseConfig from "src/config/database.config";
import config from '../mikro-orm.config'
import { BullModule } from "@nestjs/bullmq";
import redisConfig from "../config/redis.config";
import { queueConfig } from "../config/queue.config";
import { QUEUES } from "../enums/queues.enum";



export const externalImports = [
    ConfigModule.forRoot({ cache: true, isGlobal: true, load: [databaseConfig, redisConfig] }),
    MikroOrmModule.forRoot(config),
    BullModule.forRoot(queueConfig),
    BullModule.registerQueue({ name: QUEUES.WELCOME_EMAIL })
]