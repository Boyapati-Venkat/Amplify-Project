import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Output to 'build' instead of 'dist' for Amplify compatibility
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})