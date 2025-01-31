import { EasyPost } from "$lib/easypost";
import type { Database } from "$lib/server/db";
import { packagesTable, tenantTable } from "$lib/server/db/schema";
import { eq, lt, gte, ne, and } from 'drizzle-orm';
import { EASYPOST_API_KEY } from '$env/static/private';

export type TrackingEvent = {
    trackingNumber: string,
    status: string,
    estimatedDelivery: Date,
    trackingUrl: string,
    latestUpdate: string
}

export class TrackingService {

    constructor(private db: Database, private tenant: string) { }

    // This method should be called whenever a tracking event is received from the carrier
    async trackEvent(trackingNumber: string, event: Omit<TrackingEvent, 'trackingNumber'>) {
        await this.db.update(packagesTable).set({
            tracking: {
                status: event.status,
                estimatedDelivery: event.estimatedDelivery,
                trackingUrl: event.trackingUrl,
                latestUpdate: event.latestUpdate,
            }
        }).where(and(
            eq(packagesTable.trackingNumber, trackingNumber),
            eq(packagesTable.tenant, this.tenant)
        ));
    }

    async addPackage(props: { name: string, trackingNumber: string, carrier: string }) {

        try {
            // Create a tracker with easypost
            console.log("Creating tracker with easypost");
            const ep = new EasyPost(EASYPOST_API_KEY);
            const tracker = await ep.Tracker.create(props.trackingNumber, props.carrier);
            if ('error' in tracker) {
                console.log("Error creating tracker with easypost", tracker.error);
                throw new Error(tracker.error?.message);
            }
            console.log("Tracker created", tracker);

            // store the update
            await this.db.insert(packagesTable).values({
                name: props.name,
                trackingNumber: props.trackingNumber,
                carrier: props.carrier,
                tenant: this.tenant,
                tracking: {
                    status: tracker.status,
                    estimatedDelivery: tracker.est_delivery_date,
                    trackingUrl: tracker.public_url,
                    latestUpdate: tracker.tracking_details[0].message,
                }
            });
            console.log("Package added to database");

            // check if the webhook is redundant


            // find slack connection for tenant
            const tenantSlackConnection = await this.db.select().from(tenantTable).where(eq(tenantTable.teamId, this.tenant)).limit(1);
            if (tenantSlackConnection.length <= 0) {
                console.log(`No slack connection found for tenant: ${this.tenant}`);
                throw new Error("Slack connection not configured"); // user visible message
            }
            console.log("Slack connection found");
            
            // send message to slack
            const slackMessage = formatTrackingSlackMessage({
                name: props.name,
                trackingNumber: props.trackingNumber,
                status: tracker.status,
                estimatedDelivery: tracker.est_delivery_date,
                trackingUrl: tracker.public_url,
                latestUpdate: tracker.tracking_details[0].message
            });
            const url = tenantSlackConnection[0].data?.incoming_webhook.url;
            if (!url) {
                console.log(`mising slack webhook url for tenant: ${this.tenant}`);
                throw new Error("Slack connection not configured");
            }
            console.log("Sending message to slack");
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: slackMessage })
            }); 
        } catch (e) {
            console.error("Error adding package", e);
            throw new Error("Error adding package");
        }       
    }

    listPackages() {
        return this.db.select().from(packagesTable).where(eq(packagesTable.tenant, this.tenant));
    }
}

export const formatTrackingSlackMessage = (t: TrackingEvent & { name: string }) => {
    let deliveryDate = "";
    if (deliveryDate) {
        deliveryDate = new Date(t.estimatedDelivery).toLocaleString('en-us', {
            year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"
        })
    } else {
        deliveryDate = "Unknown"
    }
    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `*${t.name}*\n ${genStatusIndicator(t.status)} ${t.status}\n Estimated Delivery: ${deliveryDate}\n Last Update: ${t.latestUpdate}`
            }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": `Track`, // ${t.carrier} ${t.tracking}
                        "emoji": true
                    },
                    "url": t.trackingUrl
                }
            ]
        }
    ]


    return JSON.stringify(blocks);
}

const genStatusIndicator = (status: string): string => {
    switch (status) {
        case "pre_transit":
            return `:large_green_circle::heavy_minus_sign::radio_button::heavy_minus_sign::radio_button::heavy_minus_sign::radio_button:`;
        case "in_transit":
            return `:large_green_circle::heavy_minus_sign::truck::heavy_minus_sign::radio_button::heavy_minus_sign::radio_button:`;
        case "out_for_delivery":
            return `:large_green_circle::heavy_minus_sign::large_green_circle::heavy_minus_sign::truck::heavy_minus_sign::radio_button:`;
        case "delivered":
            return `:large_green_circle::heavy_minus_sign::large_green_circle::heavy_minus_sign::large_green_circle::heavy_minus_sign::package:`;
        default:
            return `:radio_button::heavy_minus_sign::radio_button::heavy_minus_sign::radio_button::heavy_minus_sign::radio_button:`;
    }
};