import { getDb } from "./server/db";


export const startup = async (platform: App.Platform): Promise<Omit<App.Locals, 'user'|'session'>> => {
    console.log("startup");

    const db = await getDb(platform);
    return {
        db: db
    };
}

