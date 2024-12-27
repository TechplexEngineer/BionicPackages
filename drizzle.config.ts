import { defineConfig } from 'drizzle-kit';
// if (!process.env.CLOUDFLARE_ACCOUNT_ID) throw new Error('CLOUDFLARE_ACCOUNT_ID is not set');
// if (!process.env.CLOUDFLARE_DATABASE_ID) throw new Error('CLOUDFLARE_DATABASE_ID is not set');
// if (!process.env.CLOUDFLARE_API_TOKEN) throw new Error('CLOUDFLARE_API_TOKEN is not set');

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/server/db/schema.ts',
	driver: "d1-http",

	// dbCredentials: {
	// 	// url: process.env.DATABASE_URL || 'sqlite://test.db'
	// 	accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
	// 	databaseId: process.env.CLOUDFLARE_DATABASE_ID,
	// 	token: process.env.CLOUDFLARE_API_TOKEN
	// },

	verbose: true,
	strict: true,

});
