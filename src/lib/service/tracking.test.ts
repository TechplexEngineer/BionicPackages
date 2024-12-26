import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TrackingService } from './tracking';
import type { Database } from '$lib/server/db';
import { createClient, type ResultSet } from '@libsql/client';
import { drizzle as drizzle_libsql, type LibSQLDatabase } from 'drizzle-orm/libsql';
import * as fs from 'fs/promises';
import { packagesTable } from '$lib/server/db/schema';
import { eq, lt, gte, ne, and } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/libsql/migrator';

describe('TrackingService', () => {
    let trackingService: TrackingService;
    let mockDb: LibSQLDatabase<Record<string, never>>
    const mockDbPath = 'test.db';
    const tenant = 'testTenant';

    beforeEach(async () => {
        const client = createClient({ url: `file:${mockDbPath}` });
        mockDb = drizzle_libsql(client);
        await migrate(mockDb, {
            migrationsFolder: "./drizzle",
            migrationsSchema: './src/lib/server/db/schema.ts',
            migrationsTable: "__drizzle_migrations",

        });
        trackingService = new TrackingService(mockDb, tenant);
    });
    afterEach(async () => {
        vi.restoreAllMocks();
        // Remove the mock database file
        await fs.access(mockDbPath);
        await fs.rm(mockDbPath);
    });

    it('should add a package', async () => {
        // arrange
        const packageProps = { name: 'Test Package', trackingNumber: '123456', carrier: 'Test Carrier' };

        // act
        await trackingService.addPackage(packageProps);

        // assert
        const res = await mockDb.select().from(packagesTable).where(and(
            eq(packagesTable.name, packageProps.name),
            eq(packagesTable.trackingNumber, packageProps.trackingNumber),
            eq(packagesTable.tenant, tenant),
            eq(packagesTable.carrier, packageProps.carrier)
        ))
        expect(res).toHaveLength(1);
    });

    it('should create a tracker with easypost for each package', async () => {

    });

    it('should list packages', async () => {
        // arrange
        const packageProps = { name: 'Test Package', trackingNumber: '123456', carrier: 'Test Carrier' };

        // act
        await trackingService.addPackage({ name: 'Test Package1', trackingNumber: '123456', carrier: 'Test Carrier' });
        await trackingService.addPackage({ name: 'Test Package2', trackingNumber: '654321', carrier: 'Test Carrier' });

        // assert
        const pkgs = await trackingService.listPackages();
        expect(pkgs).toHaveLength(2);
    });

    it('should update a package status when a tracking event is received', async () => {
        // arrange
        const packageProps = { name: 'Test Package', trackingNumber: '123456', carrier: 'Test Carrier' };
        await trackingService.addPackage(packageProps);
        const trackingNumber = '123456';
        const event = {
            status: 'In Transit',
            estimatedDelivery: new Date('2023-10-10'),
            trackingUrl: 'http://example.com/track/123456',
            latestUpdate: 'Package has left the facility'
        };

        // act
        await trackingService.trackEvent(trackingNumber, event);

        // assert
        const res = await mockDb.select().from(packagesTable).where(eq(packagesTable.trackingNumber, trackingNumber));
        expect(res).toHaveLength(1);
        expect(res[0].tracking?.status).toBe(event.status);
        expect(res[0].tracking?.estimatedDelivery).toBe(event.estimatedDelivery);
        expect(res[0].tracking?.trackingUrl).toBe(event.trackingUrl);
        expect(res[0].tracking?.latestUpdate).toBe(event.latestUpdate);
    });

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