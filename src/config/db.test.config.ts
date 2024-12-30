import { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs";
import { SqliteDriver } from "@mikro-orm/sqlite";

export const DB_TEST_CONFIG: MikroOrmModuleSyncOptions = {
    entities: ['./dist/models/*.model.js'],
    entitiesTs: ['./src/models/*.model.ts'],
    dbName: ":memory:",
    ensureDatabase: { create: true },
    allowGlobalContext: true,
    driver: SqliteDriver,
}