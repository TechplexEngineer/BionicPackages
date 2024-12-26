import type { EasyPostWebhook } from '$lib/easypost/WebhookResponse';
import { TrackingService } from '$lib/service/tracking';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, request }) => {
    const r = await request.json<EasyPostWebhook>();

    const tenant = "";
    const svc = new TrackingService(locals.db, tenant);
    await svc.trackEvent(r.result.tracking_code, {
        status: r.result.status,
        estimatedDelivery: r.result.est_delivery_date,
        trackingUrl: r.result.public_url,
        latestUpdate: r.result.tracking_details[0].message
    })

    return new Response("");
};