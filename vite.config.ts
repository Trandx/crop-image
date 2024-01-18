import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  resolve: {
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'Crop_image',
      fileName: 'index',
      formats: ["es", "cjs", "umd", "iife"],
    },
    minify: "esbuild"
    
  },
})
