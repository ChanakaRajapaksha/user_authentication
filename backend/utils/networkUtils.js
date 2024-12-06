const os = require('os');

const getNetworkDetails = async () => {
    try {
        const fetch = (await import('node-fetch')).default;
        // Fetch public IP address using the native fetch API
        const publicIpResponse = await fetch('https://api.ipify.org?format=json');
        if (!publicIpResponse.ok) {
            throw new Error(`Failed to fetch public IP: ${publicIpResponse.statusText}`);
        }
        const publicIpData = await publicIpResponse.json();
        const publicIp = publicIpData.ip;

        let localIp = '';
        let macAddress = '';
        const username = os.userInfo().username;
        const networkInterfaces = os.networkInterfaces();

        // Extract local IP and MAC address
        for (const interfaceName in networkInterfaces) {
            const networkInterface = networkInterfaces[interfaceName];
            for (const address of networkInterface) {
                if (address.family === 'IPv4' && !address.internal) {
                    localIp = address.address;
                    macAddress = address.mac;
                    break;
                }
            }
            if (localIp) break;
        }

        return {
            publicIp,
            localIp,
            macAddress,
            username
        };
    } catch (error) {
        console.error('Error fetching network details:', error.message);
        throw new Error('Error fetching network details');
    }
};

module.exports = { getNetworkDetails };
