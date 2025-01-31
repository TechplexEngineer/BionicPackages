// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { D1Database } from "@miniflare/d1";
import type { Database } from "$lib/server/db";
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			db: Database;
		}
		interface Platform {
			env?: {
				bionic_packages_db: D1Database
				EASYPOST_API_KEY: string;
			}
		}
		interface PageData {
			flash?: { type: 'info' | 'success' | 'warning' | 'error'; message: string };
		}
		// interface Error {}
		// interface PageState {}
	}
}



export { };
