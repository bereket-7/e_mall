import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function plugins() {
  const list = [vue()]
  // MetaGPT source locator is for local/dev tooling only — skip on Vercel/CI builds
  if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'production') {
    try {
      const { viteSourceLocator } = await import('@metagptx/vite-plugin-source-locator')
      list.push(viteSourceLocator({ prefix: 'mgx' }))
    } catch {
      /* optional */
    }
  }
  return list
}

export default defineConfig(async () => ({
  plugins: await plugins(),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    chunkSizeWarningLimit: 1000
  }
}))
