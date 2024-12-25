import type { Database } from "$lib/server/db";
import { packages } from "$lib/server/db/schema";


export class TrackingService {

    constructor(private db: Database, private tennant: string) { }

    // This method should be called whenever a tracking event is received from the carrier
    trackEvent(trackingNumber: string, event: { status: string, estimatedDelivery: string, trackingUrl: string, latestUpdate: string }) {

    }

    addPackage(props: { name: string, trackingNumber: string, carrier: string }) {
        this.db.insert(packages).values({
            // name: props.name,
            trackingNumber: props.trackingNumber,
            // carrier: props.carrier,
            // tennant: this.tennant
        });
    }

    listPackages() { }
}