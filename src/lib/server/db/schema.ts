import { sqliteTable, text, integer, } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});
export type User = typeof user.$inferSelect;

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});
export type Session = typeof session.$inferSelect;

export type slackConData = {
	ok: boolean
	app_id: string
	authed_user: {
		id: string
	}
	scope: string
	token_type: string
	access_token: string
	bot_user_id: string
	team: {
		id: string
		name: string
	}
	enterprise: any
	is_enterprise_install: boolean
	incoming_webhook: {
		channel: string
		channel_id: string
		configuration_url: string
		url: string
	}
}


export const slackConnections = sqliteTable('slackcon', {
	id: integer('id').primaryKey(),
	// teamId: text('teamId'), // make this a virtual (generated) column
	data: text('data', { mode: 'json' }).$type<slackConData>()
});
export type SlackConnections = typeof slackConnections.$inferSelect;

export type trackingData = {
	status: string, estimatedDelivery: string, trackingUrl: string, latestUpdate: string
};

export const packagesTable = sqliteTable('packages', {
	id: integer('id').primaryKey(),
	trackingNumber: text('trackingNumber'),
	name: text('name'),
	carrier: text('carrier'),
	tennant: text('tennant'),
	tracking: text('tracking', { mode: 'json' }).$type<trackingData>()
});
export type Packages = typeof slackConnections.$inferSelect;