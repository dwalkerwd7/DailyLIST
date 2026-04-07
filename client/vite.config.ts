import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
    return {
        base: '/dailylist', // put whatever relative path that dailylist will be served on
        build: {
            outDir: '../server/public',
            emptyOutDir: true,
        },
        plugins: [react(), tailwindcss()]
    }
})
