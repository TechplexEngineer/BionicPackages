import type { Actions, PageServerLoad } from './$types';
import { redirect } from 'sveltekit-flash-message/server'

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async ({ request, locals, cookies }) => {
        const data = await request.formData();
        const message = data.get('message')?.toString();
        const typ = data.get('type')?.toString() as ('success' | 'error');
        return redirect(
            "/",
            {
                type: typ || "success",
                message: message || "No message provided"
            },
            cookies
        )
    },
};