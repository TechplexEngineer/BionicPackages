import type { EasyPostErrorResponse, EasyPostTrackerCreateResponse } from "./TrackerCreateResponse";
import type { EasyPostTrackerListResponse } from "./TrackerListResponse";

class EasyPostTracker {
    private readonly apiKey: string;
    private trackerEndpoint = "https://api.easypost.com/v2/trackers";

    constructor(easyPostApiToken: string) {
        this.apiKey = easyPostApiToken;
    }

    async create(tracking_code: string, carrier: string): Promise<EasyPostTrackerCreateResponse & EasyPostErrorResponse> {
        const body = {
            tracker: {
                tracking_code: tracking_code,
                carrier: carrier
            }
        }
        console.log("pre-create");
        const response = await fetch(this.trackerEndpoint, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                Authorization: "Basic " + btoa(this.apiKey),
                "Content-Type": "application/json"
            },
        });
        console.log("post create");
        return await response.json<EasyPostTrackerCreateResponse>();
    }

    async list(): Promise<EasyPostTrackerListResponse> {
        const response = await fetch(this.trackerEndpoint, {
            method: "GET",
            headers: {
                Authorization: "Basic " + btoa(this.apiKey),
                "Content-Type": "application/json"
            },
        });

        return await response.json<EasyPostTrackerListResponse>();
    }
}

export class EasyPost {
    public Tracker: EasyPostTracker;

    constructor(private easyPostApiToken: string) {
        this.Tracker = new EasyPostTracker(easyPostApiToken)
    }
}