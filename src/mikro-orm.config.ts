import { defineConfig } from "@mikro-orm/core";
import { EntityGenerator } from "@mikro-orm/entity-generator";
import { Migrator } from "@mikro-orm/migrations";
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
    extensions: [EntityGenerator, Migrator],
    dbName: process.env.PG_NAME,
    debug: true,
    baseDir: process.cwd(),
    driver: PostgreSqlDriver,
    logger: (msg) => logger.debug(msg),
    seeder: {
        path: "./src/seeders",
        pathTs: "./src/seeders",
        defaultSeeder: 'DatabaseSeeder',
        glob: '!(*.d).{js,ts}',
        emit: 'ts',
        fileName: (className: string) => className,
    },
    migrations: {
        tableName: 'migrations',
        path: './dist/migrations',
        pathTs: "./src/migrations",
        glob: '!(*.d).{js,ts}',
        transactional: true,
        disableForeignKeys: true,
        allOrNothing: true,
        dropTables: true,
        safe: false,
        snapshot: true,
        emit: 'ts',
    },

});
