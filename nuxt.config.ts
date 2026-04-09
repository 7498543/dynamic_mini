// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  devServer: {
    port: 8116,
  },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/ui"],

  runtimeConfig: {
    database: {
      url: process.env.DATABASE_URL,
    },
  },
});
