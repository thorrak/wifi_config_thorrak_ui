import path from 'node:path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import compression from 'vite-plugin-compression'

// Generic UI sources compiled straight from the esp_wifi_config submodule.
const wificonfigUi = path.resolve(__dirname, 'esp_wifi_config/frontend/src')

// `npm run dev:server` (tools/test_server.tiltbridge.json) or a real device.
const deviceServer = 'http://127.0.0.1:8080'

export default defineConfig({
  plugins: [
    preact(),
    compression({ algorithm: 'gzip', verbose: false, deleteOriginFile: true })
  ],
  resolve: {
    // Bare `@wificonfig/ui` -> lib.ts barrel; `@wificonfig/ui/<path>` -> file
    // inside the submodule's src (styles, deep imports).
    alias: [
      { find: /^@wificonfig\/ui$/, replacement: path.join(wificonfigUi, 'lib.ts') },
      { find: /^@wificonfig\/ui\/(.*)$/, replacement: path.join(wificonfigUi, '$1') },
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: deviceServer,
        changeOrigin: true,
      }
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
