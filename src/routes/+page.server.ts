import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { ZoneControl } from '$lib/relaybox';
import type { Zone } from '$lib/zonemgr';

export const load = (async ({ locals }) => {
    let zones: Zone[] = [];
    let errors = [];
    try {
        zones = await locals.zoneMgr.getZones();
    } catch (e) {
        errors.push(`Error fetching zones: ${e}`);
    }

    let topTemp = -1;
    try {
        topTemp = await locals.tempMgr.getTopTemp();
    } catch (e) {
        errors.push(`Error fetching top temp: ${e}`);
    }
    let midTemp = -1;
    try {
        midTemp = await locals.tempMgr.getMidTemp();
    } catch (e) {
        errors.push(`Error fetching mid temp: ${e}`);
    }
    let botTemp = -1;
    try {
        botTemp = await locals.tempMgr.getBotTemp();
    } catch (e) {
        errors.push(`Error fetching bot temp: ${e}`);
    }

    return {
        zones: zones,
        temps: {
            top: topTemp,
            mid: midTemp,
            bot: botTemp,
        },
        errors: errors,
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    set: async ({ request, locals }) => {
        const data = await request.formData();
        const control = data.get('control');
        const zoneNum = parseInt(data.get('zone')?.toString()!);
        const durationhrs = parseFloat(data.get('durationhrs')?.toString()!);

        await locals.zoneMgr.setZone(zoneNum, control as ZoneControl, durationhrs);
    },
};