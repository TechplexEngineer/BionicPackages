import { EasyPost } from "$lib/easypost";
import type { Database } from "$lib/server/db";
import { packagesTable } from "$lib/server/db/schema";
import { eq, lt, gte, ne, and } from 'drizzle-orm';
import { EASYPOST_API_KEY } from '$env/static/private';


export class TrackingService {

    constructor(private db: Database, private tennant: string) { }

    // This method should be called whenever a tracking event is received from the carrier
    async trackEvent(trackingNumber: string, event: { status: string, estimatedDelivery: Date, trackingUrl: string, latestUpdate: string }) {
        await this.db.update(packagesTable).set({
            tracking: {
                status: event.status,
                estimatedDelivery: event.estimatedDelivery,
                trackingUrl: event.trackingUrl,
                latestUpdate: event.latestUpdate,
            }
        }).where(and(
            eq(packagesTable.trackingNumber, trackingNumber),
            eq(packagesTable.tennant, this.tennant)
        ));
    }

    async addPackage(props: { name: string, trackingNumber: string, carrier: string }) {

        // Create a tracker with easypost
        const ep = new EasyPost(EASYPOST_API_KEY);
        const tracker = await ep.Tracker.create(props.trackingNumber, props.carrier);
        if ('error' in tracker) {
            throw new Error(tracker.error?.message);
        }

        await this.db.insert(packagesTable).values({
            name: props.name,
            trackingNumber: props.trackingNumber,
            carrier: props.carrier,
            tennant: this.tennant,
            tracking: {
                status: tracker.status,
                estimatedDelivery: tracker.est_delivery_date,
                trackingUrl: tracker.public_url,
                latestUpdate: tracker.tracking_details[0].datetime,
            }
        });
    }

    listPackages() {
        return this.db.select().from(packagesTable).where(eq(packagesTable.tennant, this.tennant));
    }
}