import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 9527,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-ui': [
            'class-variance-authority', 'clsx', 'tailwind-merge',
            '@radix-ui/react-avatar', '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu', '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-tooltip',
          ],
          'vendor-charts': ['echarts', 'echarts-for-react'],
          'vendor-editor': ['@tiptap/react', '@tiptap/starter-kit'],
        },
      },
    },
  },
})
