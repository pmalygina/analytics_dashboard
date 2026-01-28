import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.min.css', '~/src/app/styles/main.css'],

  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '',
        },
      },
    },
    optimizeDeps: {
      include: ['vuetify'],
    },
    ssr: {
      noExternal: ['vuetify'],
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },
})
