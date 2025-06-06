import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import ui from "@nuxt/ui/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss(), ui()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 80,
    proxy: {
      "/api": {
        target: "http://localhost:5083",
        changeOrigin: true,
      },
      // "/ws": {
      //   target: "http://localhost:5083",
      //   changeOrigin: true,
      //   ws: true,
      // },
    },
  },
});
