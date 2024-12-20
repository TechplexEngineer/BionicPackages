// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { ZoneMgr } from '$lib/zonemgr';
import type { TempMgr } from '$lib/tempmgr';
import type { PromisifiedBus } from '$lib/utils/i2c-bus-mock';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			zoneMgr: ZoneMgr,
			tempMgr: TempMgr,
			rawBus: PromisifiedBus
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
