import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // PWA plugin configuration can be added here later (see Phase 21)
  // Example: import { VitePWA } from 'vite-plugin-pwa'
  // plugins: [react(), VitePWA({ ... })]
})
