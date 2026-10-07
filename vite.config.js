import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: { DELCOM_BASEURL: JSON.stringify('https://open-api.delcom.org/api/v1') },
  server: { port: Number(process.env.APP_PORT || process.env.VITE_APP_PORT || 3000) },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/main.js', 'src/setupTests.js', 'src/test-utils.js', '**/*.test.js'],
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
    },
  },
})
