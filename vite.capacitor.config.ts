/**
 * Vite config for Capacitor static build (APK)
 * Outputs a plain SPA to /dist with index.html
 * Run: npx vite build --config vite.capacitor.config.ts
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  // SPA fallback — all routes served by index.html
  define: {
    "import.meta.env.VITE_CAPACITOR": JSON.stringify("true"),
  },
});
