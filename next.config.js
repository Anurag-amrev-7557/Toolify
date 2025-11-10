const runtimeCaching = [
  {
    // Google fonts caching
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 },
    },
  },
  {
    // CDN / third-party assets
    urlPattern: /^https:\/\/.+\.(?:cdn|cloudfront)\..*$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'cdn-assets',
      expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
    },
  },
  {
    // Images
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
  {
    // Next.js static files
    urlPattern: /^\/_next\/static\/.*$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'next-static',
      expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
    },
  },
  {
    // API responses - network first with short timeout
    urlPattern: /^\/api\/.*$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-responses',
      networkTimeoutSeconds: 10,
      expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
    },
  },
]

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
})

module.exports = withPWA({
  reactStrictMode: true,
})
