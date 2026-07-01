import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue()
  ],
  base: process.env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.json', '.ts', '.jsx', '.tsx', '.vue']
  },
  server: {
    port: 5174,
    strictPort: false,
    host: true
  },
  build: {
    target: 'es2015',
    cssTarget: 'chrome80',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue'],
          'open-file-viewer': ['@open-file-viewer/core']
        }
      }
    }
  },
  css: {
    devSourcemap: true
  }
})
