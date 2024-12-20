import os from 'os';
import { RelayBox } from './relaybox';
import { TempMgr } from './tempmgr';
import { ZoneMgr } from './zonemgr';
import { setupHostname } from './utils/hostname';
import { dev } from '$app/environment';

const isRaspberryPi = os.arch() === 'arm64' && os.platform() === 'linux';

export const startup = async (): Promise<App.Locals> => {
    console.log('Starting up hardware');

    const i2cBus = isRaspberryPi ? await import('i2c-bus') : await import('$lib/utils/i2c-bus-mock');

    const i2cBusNum = parseInt(process.env.HEATPI_I2C_BUS_NUM ?? '1', 10);
    const con = await i2cBus.openPromisified(i2cBusNum);

    const relayBox = new RelayBox(con);
    
    if (!dev) {
        setupHostname(process.env.HEATPI_HOSTNAME ?? "heatpi");
    } else {
        console.log('Skipping hostname setup in dev mode');
    }

    return {
        zoneMgr: new ZoneMgr(relayBox),
        tempMgr: new TempMgr(con),
        rawBus: con
    };
}

