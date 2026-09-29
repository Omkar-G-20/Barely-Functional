import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "cattle_hero.jpg", "silage_hands.jpg"],
      manifest: {
        name: "AgriFeed – Feed & Silage Quality",
        short_name: "AgriFeed",
        description:
          "AI-powered feed and silage quality assessment for dairy farmers. Works offline.",
        theme_color: "#1b5e20",
        background_color: "#1b5e20",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        categories: ["agriculture", "utilities", "health"],
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [],
      },
      workbox: {
        // Allow larger images in offline precache
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        // Cache all app shell resources aggressively
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2}"],

        // Runtime caching strategies
        runtimeCaching: [
          // Cache API GET calls (analysis history, reports list) for 24h
          {
            urlPattern: /^https?:\/\/.*\/api\/reports/,
            handler: "NetworkFirst",
            options: {
              cacheName: "agrifeed-reports-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Cache analysis history
          {
            urlPattern: /^https?:\/\/.*\/api\/analyses/,
            handler: "NetworkFirst",
            options: {
              cacheName: "agrifeed-analyses-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 48, // 48 hours
              },
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Cache uploaded/annotated images
          {
            urlPattern: /^https?:\/\/.*\/uploads\//,
            handler: "CacheFirst",
            options: {
              cacheName: "agrifeed-images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts (if ever used)
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
        ],

        // Don't cache API write requests (POST, etc.)
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
      },

      // Dev mode: enable PWA service worker during development for testing
      devOptions: {
        enabled: true,
      },
    }),
  ],

  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
