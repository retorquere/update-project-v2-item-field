import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['json-summary', 'text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**'],
    },
  },
})
