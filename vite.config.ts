import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'os';

const getNetworkAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        //@ts-ignore
        for (const iface of interfaces[name]) {
            const { address, family, internal } = iface;
            if (family === 'IPv4' && !internal) {
                return address;
            }
        }
    }
};

const localIp = getNetworkAddress();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    optimizeDeps: {
        exclude: ['typescript'],
    },
    server: {
        host: localIp, // Use your local IP address
        port: 5167, // Any port you prefer
    },
});

