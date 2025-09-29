import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

const backendAddress = "http://192.168.1.230:3000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 80,
    proxy: {
      "/api": {
        target: backendAddress,
      },
      "/cdn": {
        target: backendAddress,
      },
      "/ws": {
        target: backendAddress,
        ws: true,
      },
    },
  },
});
