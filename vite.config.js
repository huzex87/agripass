import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      "/disbursify": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: { // <-- Add the resolve block
        alias: { // <-- Add the alias configuration
          "@": path.resolve(__dirname, "./src"), // Map @ to your src directory
        },
      },
});
