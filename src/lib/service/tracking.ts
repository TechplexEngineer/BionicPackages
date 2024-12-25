import type { Database } from "$lib/server/db";
import { packagesTable } from "$lib/server/db/schema";
import { eq, lt, gte, ne, and } from 'drizzle-orm';


export class TrackingService {

    constructor(private db: Database, private tennant: string) { }

    // This method should be called whenever a tracking event is received from the carrier
    trackEvent(trackingNumber: string, event: { status: string, estimatedDelivery: string, trackingUrl: string, latestUpdate: string }) {
        return this.db.update(packagesTable).set({
            tracking: event
        }).where(and(
            eq(packagesTable.trackingNumber, trackingNumber),
            eq(packagesTable.tennant, this.tennant)
        ));
    }

    async addPackage(props: { name: string, trackingNumber: string, carrier: string }) {
        await this.db.insert(packagesTable).values({
            name: props.name,
            trackingNumber: props.trackingNumber,
            carrier: props.carrier,
            tennant: this.tennant
        });
    }

    listPackages() {
        return this.db.select().from(packagesTable).where(eq(packagesTable.tennant, this.tennant));
    }
}