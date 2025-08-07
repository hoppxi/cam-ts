import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/Capture.ts',
      name: 'Capture',
      fileName: 'capture',
    },
    outDir: 'dist',
  },
});

