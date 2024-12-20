import dbus from 'dbus-final';

export const setupHostname = async (hostname: string) => {
    try {
        setHostname(hostname);

        advertiseHostname(hostname);
    } catch (e) {
        console.log(`Caught Error setting up hostname: ${e}`);
    }
};

export const setHostname = async (hostname: string) => {
    if (process.env.BALENA_SUPERVISOR_ADDRESS) {
        console.log(`Updating hostname to: ${hostname}`);
        const response = await fetch(`${process.env.BALENA_SUPERVISOR_ADDRESS}/v1/device/host-config?apikey=${process.env.BALENA_SUPERVISOR_API_KEY}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                network: {
                    hostname: hostname
                }
            })
        });

        if (!response.ok) {
            console.log(`Failed to update hostname: ${response.statusText}`);
        } else {
            console.log(`Hostname updated to ${hostname}`);
        }
    } else {
        console.log("\x1b[31mError: Skipping hostname change. Unable to access supervisor environment variables.\x1b[0m");
    }
}

export const advertiseHostname = async (hostname: string) => {

    const bus = dbus.systemBus();
    const obj = await bus.getProxyObject('org.freedesktop.Avahi', '/');
    const server = obj.getInterface('org.freedesktop.Avahi.Server');

    try {
        await server.SetHostName(hostname);
        console.log(`Hostname advertised via Avahi: ${hostname}`);
    } catch (e) {
        console.log(`Caught Error advertising hostname: ${e}`);
    }
}