import { ZoneControl, type RelayBox } from "./relaybox";

export enum ZoneStatus {
    on = 'on',
    off = 'off',
    unknown = 'unknown',
}


export type Zone = {
    name: string,
    status: ZoneStatus,
    id: number,
    settingActiveUntil?: Date | undefined,
    control?: ZoneControl
}

let zones: Zone[] = [
    {
        name: "Master Bed Room",
        status: ZoneStatus.unknown,
        id: 3,
        // settingActiveUntil: new Date(),
        // control: ZoneControl.on,
    },
    {
        name: "Blake's Bed Room",
        status: ZoneStatus.unknown,
        id: 2,
    },
    {
        name: "First Floor",
        status: ZoneStatus.unknown,
        id: 4,
    },
    {
        name: "First Floor Radiant",
        status: ZoneStatus.unknown,
        id: 1,
    },
    {
        name: "Domestic Hot Water",
        status: ZoneStatus.unknown,
        id: 5,
    },
    {
        name: "Basement Radiant",
        status: ZoneStatus.unknown,
        id: 0,
    }
];

export class ZoneMgr {
    constructor(private relayBox: RelayBox, updateFreq: number = 1000 * 60 * .25) {
        console.log('ZoneMgr starting up');
        // if settings have expired, set control to thermostat
        setInterval(async () => {
            console.log('Checking for expired settings');
            for (const zone of zones) {
                if (zone.settingActiveUntil && Date.now() > zone.settingActiveUntil.getTime()) {
                    console.log(`Clearing setting on zone ${zone.id}`);
                    zone.control = ZoneControl.thermostat;
                    zone.settingActiveUntil = undefined;
                    await this.relayBox.setZone(zone.id, zone.control);
                }
            }
        }, updateFreq);
    }

    async getZones() {
        const status = await this.relayBox.getAllZoneStatus()
        for (const zone of zones) {
            const zoneStatus = status[zone.id];
            if (zoneStatus) {
                zone.status = ZoneStatus.on;
            } else {
                zone.status = ZoneStatus.off;
            }
        }
        return zones
    }

    async setZone(zoneNum: number, control: ZoneControl, durationhrs: number) {
        const zone = zones.find(z => z.id === zoneNum);
        if (!zone) {
            console.error(`Zone ${zoneNum} not found`);
            return;
        }
        console.log(`Setting zone ${zoneNum} to ${control} for ${durationhrs} hours`);
        zone.control = control;
        if (control == ZoneControl.thermostat) {
            zone.settingActiveUntil = undefined;
        } else {
            zone.settingActiveUntil = new Date(Date.now() + durationhrs * 60 * 60 * 1000);
        }

        await this.relayBox.setZone(zoneNum, control);
    }
}