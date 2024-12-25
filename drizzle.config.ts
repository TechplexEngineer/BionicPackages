import { defineConfig } from 'drizzle-kit';
if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'test') throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: process.env.DATABASE_URL || 'sqlite://test.db'
	},

	verbose: true,
	strict: true,
	dialect: 'sqlite'
});
