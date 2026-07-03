import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "./dist/stats.html",
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "react-core": ["react", "react-dom"],
          // React Router
          "react-router": ["react-router-dom"],
          // Tiptap Editor (separate chunk)
          tiptap: [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/extension-underline",
            "@tiptap/extension-text-align",
            "@tiptap/extension-link",
            "@tiptap/extension-highlight",
            "@tiptap/extension-text-style",
            "@tiptap/extension-color",
          ],
          // Radix UI components
          "radix-ui": [
            "@radix-ui/react-avatar",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
          ],
          // Animation libraries
          animation: ["framer-motion", "swiper"],
          // Form handling
          forms: ["react-hook-form", "@hookform/resolvers", "yup"],
          // Utilities
          utils: [
            "axios",
            "dayjs",
            "jwt-decode",
            "dompurify",
            "clsx",
            "tailwind-merge",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:3002",
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
