import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      srcDir: 'src',
      filename: 'sw.ts',
      manifest: false,
      strategies: 'injectManifest',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        swSrc: 'src/sw.ts',
        minify: false,
        rollupFormat: 'iife',
      },
    }),
  ],
})
