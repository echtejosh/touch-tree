import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react(), svgr()],
        base: env.VITE_BASE_PATH || '/',
        resolve: {
            alias: {
                infrastructure: path.resolve(__dirname, './src/infrastructure'),
                presentation: path.resolve(__dirname, './src/presentation'),
                application: path.resolve(__dirname, './src/application'),
                domain: path.resolve(__dirname, './src/domain'),
                utils: path.resolve(__dirname, './src/utils'),
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: 3000,
            open: true,
        },
        build: {
            outDir: 'build',
        },
        test: { // Vitest-specific config
            globals: true,
            environment: 'jsdom',
        },
    };
});
