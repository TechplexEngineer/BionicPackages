import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TrackingService } from './tracking';
import type { Database } from '$lib/server/db';
import { createClient, type ResultSet } from '@libsql/client';
import { drizzle as drizzle_libsql } from 'drizzle-orm/libsql';
import * as fs from 'fs/promises';
import { packages } from '$lib/server/db/schema';
import { eq, lt, gte, ne } from 'drizzle-orm';

describe('TrackingService', () => {
    let trackingService: TrackingService;
    let mockDb: Database
    const mockDbPath = 'test.db';

    beforeEach(() => {
        const client = createClient({ url: `file:${mockDbPath}`});
        mockDb = drizzle_libsql(client);
        trackingService = new TrackingService(mockDb, 'testTenant');
    });
    afterEach(async () => {
        vi.restoreAllMocks();
        // Remove the mock database file
        await fs.access(mockDbPath);
        await fs.rm(mockDbPath);
    });

    it('should add a package', () => {
        
        const packageProps = { name: 'Test Package', trackingNumber: '123456', carrier: 'Test Carrier' };

        trackingService.addPackage(packageProps);

        mockDb.select().from(packages).where(eq(packages.trackingNumber, '123456')).execute()

        // expect(addPackageSpy).toHaveBeenCalledWith(packageProps);
    });

    // it('should list packages', () => {
    //     const listPackagesSpy = vi.spyOn(mockDb, 'listPackages');

    //     trackingService.listPackages();

    //     expect(listPackagesSpy).toHaveBeenCalled();
    // });

    // it('should track an event', () => {
    //     const trackEventSpy = vi.spyOn(mockDb, 'trackEvent');
    //     const trackingNumber = '123456';
    //     const event = {
    //         status: 'In Transit',
    //         estimatedDelivery: '2023-10-10',
    //         trackingUrl: 'http://example.com/track/123456',
    //         latestUpdate: 'Package has left the facility'
    //     };

    //     trackingService.trackEvent(trackingNumber, event);

    //     expect(trackEventSpy).toHaveBeenCalledWith(trackingNumber, event);
    // });
});