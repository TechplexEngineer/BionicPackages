import { drizzle as drizzle_libsql } from 'drizzle-orm/libsql';
import { drizzle as drizzle_d1, DrizzleD1Database } from "drizzle-orm/d1";
import { createClient, type ResultSet } from '@libsql/client';
import { env } from '$env/dynamic/private';
import { type BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core/db';
import type { D1Result } from '@miniflare/d1';

export type Database = DrizzleD1Database



export const getDb = async (platform: App.Platform) => {
    if (!platform.env?.bionic_packages_db) {
        throw new Error("database binding not set: 'bionic_packages_db'")
    }
    return drizzle_d1(platform.env?.bionic_packages_db)

    // if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
    // const client = createClient({ url: env.DATABASE_URL });
    // return drizzle_libsql(client);
}