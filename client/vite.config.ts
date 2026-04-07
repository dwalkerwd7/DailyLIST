import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // strip trailing slash so BASE_URL and hardcoded /api/... slashes don't collide
    const rawBase = mode === 'production' ? (loadEnv(mode, process.cwd(), '').BASE_PATH ?? '/') : '/';
    const BASE_PATH = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
    return {
        base: BASE_PATH,
        build: {
            outDir: '../server/public',
            emptyOutDir: true,
        },
        plugins: [react(), tailwindcss()]
    }
})
