import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    

    return {
        zones: [],
        temps: {
            top: 1,
            mid: 1,
            bot: 1,
        },
        errors: [],
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    // set: async ({ request, locals }) => {
    //     const data = await request.formData();
    //     const control = data.get('control');
    //     const zoneNum = parseInt(data.get('zone')?.toString()!);
    //     const durationhrs = parseFloat(data.get('durationhrs')?.toString()!);

    //     await locals.zoneMgr.setZone(zoneNum, control as ZoneControl, durationhrs);
    // },
};