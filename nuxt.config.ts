export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Audio Analyse',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
})
