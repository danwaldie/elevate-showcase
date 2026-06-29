import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Elevate · Cedar Lake',
        short_name: 'Cedar Lake',
        description: 'Your directory for the Elevate Cedar Lake retreat — the people, the schedule, and a concierge who knows the room.',
        theme_color: '#20281F',
        background_color: '#20281F',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /\/api\/content/,
            handler: 'NetworkFirst',
            options: { cacheName: 'elevate-content', networkTimeoutSeconds: 5 },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      // When running `npm run pages:dev` (wrangler) alongside `npm run dev` (vite),
      // forward API calls to the Functions runtime.
      '/api': 'http://localhost:8788',
    },
  },
})
