import { sql } from 'drizzle-orm/sql';
import { sqliteTable, text, integer, } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});
export type User = typeof user.$inferSelect;

export const sessionTable = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});
export type Session = typeof sessionTable.$inferSelect;

export type trackingData = {
	status: string,
	estimatedDelivery: Date,
	trackingUrl: string,
	latestUpdate: string
};

export const packagesTable = sqliteTable('packages', {
	id: integer('id').primaryKey(),
	trackingNumber: text('trackingNumber'),
	name: text('name'),
	carrier: text('carrier'),
	tenant: text('tenant'),
	tracking: text('tracking', { mode: 'json' }).$type<trackingData>()
});
export type Packages = typeof packagesTable.$inferSelect;

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
		url: string //https://hooks.slack.com/services/<teamid>/<service>/<unique>
	}
}

export const tenantTable = sqliteTable('tenant', {
	id: integer('id').primaryKey(),
	teamId: text('teamId').generatedAlwaysAs(sql`json_extract(data, '$.team.id')`), // make this a virtual (generated) column
	data: text('data', { mode: 'json' }).$type<slackConData>()
});
export type Tenant = typeof tenantTable.$inferSelect;



