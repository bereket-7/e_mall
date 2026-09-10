import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSourceLocator } from '@metagptx/vite-plugin-source-locator'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    viteSourceLocator({
      prefix: 'mgx'
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'node',
    globals: true
  }
})
