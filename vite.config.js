import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from 'vite'

// ESM 환경에서 __dirname을 흉내내는 코드
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})