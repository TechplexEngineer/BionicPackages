import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { TrackingService } from '$lib/service/tracking';

export const load = (async ({ locals }) => {

    const svc = new TrackingService(locals.db, "tenant");

    return {
        packages: await svc.listPackages(),
        // [
        //     {trackingNumber:"12345", name: "Test", status: "Delivered", estDelivery: "", trackingUrl: "", latestUpdate: "", carrier: "UPS"},
        // ],
        errors: [],
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    add: async ({ request, locals }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString();
        const tracking = data.get('tracking')?.toString();
        const carrier = data.get('carrier')?.toString();

        if (!name || !tracking || !carrier) {
            return fail(400, { message: "Missing required fields" });
        }

        const svc = new TrackingService(locals.db, "tenant");
        svc.addPackage({ name: name!, trackingNumber: tracking!, carrier: carrier! });
    },
};