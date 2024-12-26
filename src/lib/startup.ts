import { getDb } from "./server/db";


export const startup = async (platform: App.Platform): Promise<Omit<App.Locals, 'user' | 'session'>> => {
    console.log("Startup");

    const db = await getDb(platform);
    if (platform.env?.bionic_packages_db) {
        // use d1
        console.log("Migrations need to be applied by wrangler manually");
    } else {
        const { migrate: migrate_libsql } = await import('drizzle-orm/libsql/migrator');
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

