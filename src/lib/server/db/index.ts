import { drizzle as drizzle_libsql } from 'drizzle-orm/libsql';
import {drizzle as drizzle_d1} from "drizzle-orm/d1";
import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';



export const getDb = async (platform: App.Platform) => {
    if (platform.env?.bionic_packages_db) {
        return drizzle_d1(platform.env?.bionic_packages_db)
    }
    if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
    const client = createClient({ url: env.DATABASE_URL });
    return drizzle_libsql(client);
}