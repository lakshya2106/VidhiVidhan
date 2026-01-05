import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Vidhi Vidhan',
      short_name: 'VidhiVidhan',
      description: 'A platform for legal document automation and management.',
      theme_color: '#0f172a',
      icons: [
        {
          src: '/VV-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/VV-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        }
      ]
    }
  })],
})
