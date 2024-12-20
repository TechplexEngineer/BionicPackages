import { sequence } from '@sveltejs/kit/hooks';
import * as auth from '$lib/server/auth.js';
import { building } from '$app/environment';
import { startup } from '$lib/startup';
import type { Handle } from '@sveltejs/kit';

// Cache the locals so we don't get new ones on every request
let appLocalsCache: Promise<Omit<App.Locals, 'user'|'session'>> | null = null;


const originalHandle: Handle = async ({ event, resolve }) => {
	if (appLocalsCache !== null) {
		if (building) {
			console.log('Building, skipping hardware startup');
		} else if (!appLocalsCache) {
			appLocalsCache = startup(event.platform!);
		}
		event.locals = await appLocalsCache;
	}

	const response = await resolve(event);
	return response;
};

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle = sequence(originalHandle, handleAuth);
