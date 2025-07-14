/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_BASE_PATH: string
    readonly VITE_TEST_DATABASE: string
    readonly VITE_TEST_EMAIL: string
    readonly VITE_TEST_PASSWORD: string
    // Add other VITE_ variables you use
    readonly VITE_ENV: string
    readonly VITE_DEBUG: string
    // ... add more as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
