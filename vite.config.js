import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    workbox: {
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // ✅ 5 MB
    },
    manifest: {
      name: 'Vidhi Vidhan',
      short_name: 'VidhiVidhan',
      description: 'A platform for legal document automation and management.',
      theme_color: '#0f172a',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/VV-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/VV-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }), cloudflare()]
})