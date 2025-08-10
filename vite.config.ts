import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "Cam-TS",
      fileName: "cam-ts",
    },
    outDir: "dist",
  },
});
