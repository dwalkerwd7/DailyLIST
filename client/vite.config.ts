import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  const appBasePath = process.env.VITE_APP_BASE_PATH || '/'
  return {
    base: appBasePath,
    plugins: [react(), tailwindcss()]
  }
})
