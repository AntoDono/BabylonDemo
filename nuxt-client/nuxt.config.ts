// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  runtimeConfig: {
    public: {
      // CMS: "https://skrunkle.siths.dev/static",
      // SOCKET_ADDR: "wss://siths2024.com:2001"
      CMS: "http://localhost:3001/static",
      SOCKET_ADDR: "ws://localhost:2000",
    },
  },
});
