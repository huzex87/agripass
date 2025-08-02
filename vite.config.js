import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/disbursify": {
        target: "https://disbursify.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    // <-- Add the resolve block
    alias: {
      // <-- Add the alias configuration
      "@": path.resolve(__dirname, "./src"), // Map @ to your src directory
    },
  },
});
