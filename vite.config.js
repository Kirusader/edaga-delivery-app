/** @format */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // put all code from node_modules into a vendor chunk
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
});
