import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // port: 80,
    proxy: {
      "/api": {
        target: "http://localhost:5083",
        changeOrigin: true,
      },
      "/cdn": {
        target: "http://localhost:5083",
        changeOrigin: true,
      },
      "/ws": {
        target: "http://localhost:5083",
        // changeOrigin: true,
        ws: true,
      },
    },
  },
});
