import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // '' in dev -- no trailing slash so ${BASE_URL}/api/... never double-slashes
    const BASE_PATH = mode === 'production' ? (loadEnv(mode, process.cwd(), '').BASE_PATH ?? '').replace(/\/+$/, '') : '';
    return {
        base: BASE_PATH || '/',
        define: { 'import.meta.env.BASE_URL': JSON.stringify(BASE_PATH) },
        build: {
            outDir: '../server/public',
            emptyOutDir: true,
        },
        plugins: [react(), tailwindcss()]
    }
})
