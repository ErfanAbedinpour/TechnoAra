import { defineConfig } from "@mikro-orm/core";
import { Migrator } from "@mikro-orm/migrations";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SeedManager } from "@mikro-orm/seeder";
import { Logger } from "@nestjs/common";
import 'dotenv/config';
import { DatabaseSeeder } from "./seeders/seed";


const logger = new Logger("MikroOrm")

const DB_URI = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}`

export default defineConfig({
    clientUrl: DB_URI,
    entities: ['./dist/models/*.model.js'],
    entitiesTs: ['./src/models/*.model.ts'],
    port: +process.env.PG_PORT,
    extensions: [Migrator, SeedManager],
    dbName: process.env.PG_NAME,
    debug: true,
    baseDir: process.cwd(),
    driver: PostgreSqlDriver,
    logger: (msg) => logger.debug(msg),
    metadataCache: { enabled: true },
    seeder: {
        path: "./src/seeders",
        pathTs: "./src/seeders",
        defaultSeeder: DatabaseSeeder.name,
        glob: '!(*.d).{js,ts}',
        emit: 'ts',
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
        emit: 'ts',
    },
});
