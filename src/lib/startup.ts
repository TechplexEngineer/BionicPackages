import { getDb } from "./server/db";
import { migrate as migrate_libsql } from 'drizzle-orm/libsql/migrator';
import { migrate as migrate_d1 } from 'drizzle-orm/d1/migrator';

export const startup = async (platform: App.Platform): Promise<Omit<App.Locals, 'user' | 'session'>> => {
    console.log("Startup");

    const db = await getDb(platform);
    if (platform.env?.bionic_packages_db) {
        // use d1
        await migrate_d1(db, {
            migrationsFolder: "./drizzle",
            migrationsSchema: './src/lib/server/db/schema.ts',
            migrationsTable: "__drizzle_migrations",

        });
    } else {
        // use libsql
        await migrate_libsql(db, {
            migrationsFolder: "./drizzle",
            migrationsSchema: './src/lib/server/db/schema.ts',
            migrationsTable: "__drizzle_migrations",

        });
    }
    console.log("Migrations Complete");

    return {
        db: db
    };
}

