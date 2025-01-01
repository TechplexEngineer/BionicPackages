import { getDb } from "./server/db";


export const startup = async (platform: App.Platform): Promise<Omit<App.Locals, 'user' | 'session'>> => {
    console.log("Startup");

    const db = await getDb(platform);

    console.log("REMINDER: Migrations need to be applied by wrangler manually [Local: npm run db:migrate][Remote: npm run db:push]");
    // if (!import.meta.env.DEV) {

    // } else {
    //     const { migrate } = await import('drizzle-orm/d1/migrator');
    //     // use libsql
    //     await migrate(db, {
    //         migrationsFolder: "./drizzle",
    //         migrationsSchema: './src/lib/server/db/schema.ts',
    //         migrationsTable: "__drizzle_migrations",

    //     });
    //     console.log("Migrations Complete");
    // }

    return {
        db: db
    };
}

