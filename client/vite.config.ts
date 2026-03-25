import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // cannot use app-constants.ts here because import.meta.env is not supported in defineConfig
  const env = loadEnv(mode, process.cwd(), '')
  const appBasePath = env.VITE_APP_BASE_PATH || '/'
  return {
    base: appBasePath,
    build: {
      outDir: `../server/public${appBasePath}`,
    },
    plugins: [react(), tailwindcss()]
  }
})
