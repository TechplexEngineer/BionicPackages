import { getSlackAPIURL } from '$lib/slack';
import type { RequestHandler } from './$types';

export const clientId = import.meta.env.VITE_SLACK_CLIENT_ID;
if (!clientId) {
    throw new Error("No Slack oauth client id set");
}

export const clientSecret = import.meta.env.VITE_SLACK_CLIENT_SECRET;
if (!clientSecret) {
    throw new Error("No Slack oauth client id set");
}


export const GET: RequestHandler = async ({request}) => {
    console.log("oauth/redirect/+server.ts GET");
    console.log("url", request.url);
    console.log("data", await request.json());
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

    const data = await response.json();
    console.log("Slack API response", data);

    return new Response("Success"); // this is shown to the user after installing the app
};