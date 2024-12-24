import type { Database } from "$lib/server/db";


export class TrackingService {

    constructor(private db: Database, private tennant: string) {}

    // This method should be called whenever a tracking event is received from the carrier
    trackEvent(trackingNumber: string, event: {status: string, estimatedDelivery: string, trackingUrl: string, latestUpdate: string}) {
        
    }

    addPackage(props: {name: string, trackingNumber: string, carrier: string}) {}

    listPackages() {}
}