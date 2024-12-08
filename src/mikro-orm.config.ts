import { defineConfig } from "@mikro-orm/core";
import { EntityGenerator } from "@mikro-orm/entity-generator";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Logger } from "@nestjs/common";
import 'dotenv/config';


const logger = new Logger("MikroOrm")

const DB_URI = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}`

export default defineConfig({
    clientUrl: DB_URI,
    entities: ['./dist/models/*.model.js'],
    entitiesTs: ['./src/models/*.model.ts'],
    port: +process.env.PG_PORT,
    extensions: [EntityGenerator],
    dbName: process.env.PG_NAME,
    debug: true,
    baseDir: process.cwd(),
    driver: PostgreSqlDriver,
    logger: (msg) => logger.debug(msg),
    seeder: {
        path: "./src/seeders", // path to the folde
        pathTs: "./src/seeders", // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
        defaultSeeder: 'DatabaseSeeder', // default seeder class name
        glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
        emit: 'ts', // seeder generation mode
        fileName: (className: string) => className, // seeder file naming convention
    },
});
