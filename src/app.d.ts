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

	interface ImportMetaEnv {
        // VITE_ONSHAPE_OAUTH_CLIENT_ID?: string;
        // VITE_ONSHAPE_OAUTH_SECRET?: string;

        // VITE_ONSHAPE_OAUTH_CLIENT_ID?: string;
        // VITE_ONSHAPE_OAUTH_CLIENT_SECRET?: string;
        // VITE_ONSHAPE_OAUTH_REDIRECT_URI?: string;

        // // VITE_TRELLO_KEY?: never;
        // VITE_TRELLO_TOKEN?: never;

        // VITE_TRELLO_KEY?: string;
        // VITE_TRELLO_SECRET?: string;
        // VITE_TRELLO_OAUTH_REDIRECT_URI?: string;

		VITE_SLACK_CLIENT_ID?: string;
		VITE_SLACK_CLIENT_SECRET?: string;
    }
}

export {};
