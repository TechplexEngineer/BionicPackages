import type { Database } from "$lib/server/db";
import { packagesTable, slackConnections } from "$lib/server/db/schema";
import { and, eq } from "drizzle-orm";
import { type TrackingEvent } from "./tracking";
import { SlackREST } from "$lib/slack";


// This method should be called whenever a tracking event is received from the carrier
export const trackEvent = async (db: Database, trackingNumber: string, event: Omit<TrackingEvent, 'trackingNumber'>) => {

    const packages = await db.select().from(packagesTable).where(eq(packagesTable.trackingNumber, trackingNumber))
    if (packages.length === 0) {
        console.error(`Package with tracking number ${trackingNumber} not found`);
        return;
    }

    // check if the webhook is redundant @todo


    await db.update(packagesTable).set({
        tracking: {
            status: event.status,
            estimatedDelivery: event.estimatedDelivery,
            trackingUrl: event.trackingUrl,
            latestUpdate: event.latestUpdate,
        }
    }).where(and(
        eq(packagesTable.trackingNumber, trackingNumber)
    ));

    


    // Send an update to slack
    
    // multiple tenants may be tracking the same package:
    for (const pkg of packages) {
        const tenantSlackConnection = await db.select().from(slackConnections).where(eq(slackConnections.data.team.id, pkg.tenant)).limit(1); //@todo
        if (tenantSlackConnection.length <= 0) {
            console.error(`No slack connection found for tenant ${pkg.tenant}`);
            return;
        }

        const data = tenantSlackConnection[0].data;
        if (!data) {
            console.error(`No slack connection *data* found for tenant ${pkg.tenant}`);
            return;
        }

        const blocks = formatTrackingSlackMessage({
            trackingNumber,
            ...event,
            name: pkg.name || "Unknown"
        });

        const slack = SlackREST(data.access_token)
        slack.chat.postMessage({channel: data.incoming_webhook.channel, blocks});

    }

    

    // find slack connection for tenant
    // send message to slack
}

export const formatTrackingSlackMessage = (t: TrackingEvent & {name: string}) => {
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
    switch(status) {
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