import { defineConfig } from "@mikro-orm/core";
import { EntityGenerator } from "@mikro-orm/entity-generator";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Logger } from "@nestjs/common";
import 'dotenv/config';


const logger = new Logger("MikroOrm")

const DB_URI = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}`

export default defineConfig({
    clientUrl: DB_URI,
    entities: ['./dist/models'],
    entitiesTs: ['./src/models'],
    port: +process.env.PG_PORT,
    extensions: [EntityGenerator],
    dbName: process.env.PG_NAME,
    debug: true,
    baseDir: process.cwd(),
    driver: PostgreSqlDriver,
    logger: (msg) => logger.debug(msg),
});
