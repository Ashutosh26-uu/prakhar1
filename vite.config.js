import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * The hero brain is lazy-loaded so text paints first. This plugin adds
 * <link rel="modulepreload"> tags for that chunk and its dependencies so
 * the browser fetches them in parallel with the main bundle instead of
 * waiting for it (removes a network waterfall).
 */
function preloadHero3D() {
  return {
    name: 'preload-hero-3d',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const chunks = Object.values(ctx.bundle || {}).filter((c) => c.type === 'chunk')
        const hero = chunks.find((c) => c.facadeModuleId && c.facadeModuleId.includes('BrainScene'))
        if (!hero) return html
        const entries = new Set(chunks.filter((c) => c.isEntry).map((c) => c.fileName))
        const files = [...new Set([hero.fileName, ...(hero.imports || [])])].filter((f) => !entries.has(f))
        return {
          html,
          tags: files.map((f) => ({
            tag: 'link',
            attrs: { rel: 'modulepreload', href: `/${f}`, crossorigin: '' },
            injectTo: 'head',
          })),
        }
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), preloadHero3D()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1800,
  },
})
