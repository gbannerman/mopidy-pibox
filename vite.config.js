import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/pibox",
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      components: "/src/components",
      hooks: "/src/hooks",
      pages: "/src/pages",
      res: "/src/res",
      services: "/src/services",
      utils: "/src/utils",
    },
  },
  build: {
    outDir: "build",
  },
  server: {
    proxy: {
      "/pibox/api": {
        target: "http://localhost:6680",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          options.hostRewrite = true;
        },
      },
      "/pibox/config": {
        target: "http://localhost:6680",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          options.hostRewrite = true;
        },
      },
      "/mopidy": {
        target: "ws://localhost:6680",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          options.hostRewrite = true;
        },
      },
      "/pibox/ws": {
        target: "ws://localhost:6680",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          options.hostRewrite = true;
        },
      },
    },
  },
});
