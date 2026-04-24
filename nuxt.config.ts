// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  devServer: {
    port: 8116,
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],

  ui: {
    fonts: false,
  },

  i18n: {
    defaultLocale: 'zh-cn',
    locales: [
      {
        code: 'zh-cn',
        name: '简体中文',
        files: ['zh-cn.json', 'zh-cn-wwws.json', 'zh-cn-form.json'],
      },
      {
        code: 'en-us',
        name: 'English',
        files: ['en-us.json', 'en-us-wwws.json', 'en-us-form.json'],
      },
    ],
    langDir: 'locales',
    strategy: 'prefix_except_default',
    vueI18n: './i18n/config.ts',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  runtimeConfig: {
    secretKey: process.env.SECRET_KEY,
    database: {
      url: process.env.DATABASE_URL,
    },
  },
});
