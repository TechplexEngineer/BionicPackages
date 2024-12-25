import { afterEach, describe, expect, it, vi } from "vitest";
import { originalHandle } from "./hooks.server";


describe('hooks.server.test.ts', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })
    it("should set event.locals.db to a database instance", async () => {
        const event: any = { platform: { env: { bionic_packages_db: true } }, locals: {} };
        let eventCapture: any = null;
        const resolve = async (event: any) => {
            eventCapture = event;
            return event
        };
        vi.mock('$lib/startup', async (importOriginal) => {
            return {
                ...await importOriginal<typeof import('$lib/startup')>(),
                startup: async (platform: any) => {
                    return { db: {} }
                }
            }
        })

        const response = await originalHandle({ event, resolve });
        expect(eventCapture.locals.db).toBeDefined();

    })
}
)