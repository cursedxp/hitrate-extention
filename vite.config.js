import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
        addButtons: resolve(__dirname, "src/content-scripts/addButtons.js"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "addButtons"
            ? "content-scripts/[name].js"
            : "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks: {
          // Vendor chunk for React and related packages
          "vendor-react": ["react", "react-dom"],
          // Firebase related packages
          "vendor-firebase": [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
          ],
          // Other third-party dependencies can be added here
        },
      },
    },
    // Increase the warning limit if needed
    chunkSizeWarningLimit: 1000,
  },
});
