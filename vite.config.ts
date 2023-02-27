import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import alias from '@rollup/plugin-alias';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'tonomy-id-sdk': __dirname + '/../Tonomy-ID-SDK'
    }
  },
  plugins: [react(),alias({
    entries: [
      // {find: 'tonomy-id-sdk',replacement: resolve() }
    ]
  })],
})
