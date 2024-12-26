import { slackConnections, type slackConData } from '$lib/server/db/schema';
import { getSlackAPIURL } from '$lib/slack';
import type { RequestHandler } from './$types';
import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } from '$env/static/private';

const clientId = SLACK_CLIENT_ID;
if (!clientId) {
    throw new Error("No Slack oauth client id set");
}

const clientSecret = SLACK_CLIENT_SECRET;
if (!clientSecret) {
    throw new Error("No Slack oauth client id set");
}


export const GET: RequestHandler = async ({ request, locals }) => {
    try {
        console.log("oauth/redirect/+server.ts GET");
        console.log("url", request.url);
        // console.log("data", await request.json());
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        console.log("code", code);

        // getSlackAPIURL("oauth.v2.access")
        const response = await fetch('https://slack.com/api/oauth.v2.access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                code: code || '',
                client_id: clientId,
                client_secret: clientSecret
            })
        });

        const data: slackConData = await response.json();
        console.log("Slack API response", data);

        await locals.db.insert(slackConnections).values({ data: data })

    } catch (e) {
        return new Response("FAILED");
    }

    return new Response("Success"); // this is shown to the user after installing the app
    // rediredt to success screen
};