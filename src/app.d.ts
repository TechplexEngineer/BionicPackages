// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type {D1Database} from "@miniflare/d1";

declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			db: DrizzleD1Database<Record<string, never>> | LibSQLDatabase<Record<string, never>>;
		}
		interface Platform {
			env?: {
				bionic_packages_db: D1Database
			}
		}
	}
}

export {};
