import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '__tests__/']
    }
  },
  resolve: {
    alias: {
      'effect-cli-tui': '/Users/paul/effect-cli-tui/src/index.ts'
    }
  }
})
