import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProd = import.meta;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    build: {
      outDir: "docs",
    },
    base: mode === "development" ? "" : "https://lceihenx.github.io/WaterMask",
  };
});
