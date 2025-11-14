import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.{ts,tsx}'],
    // coverage: {
    //   provider: 'v8',
    //   reporter: ['text', 'json', 'html'],
    //   exclude: ['node_modules/', '__tests__/']
    // }
  },
  esbuild: {
    target: 'node20',
    jsx: 'automatic',
    jsxImportSource: 'react'
  },
  resolve: {
    alias: {
      'effect-cli-tui': '/Users/paul/Projects/Published/effect-cli-tui/dist/index.js'
    }
  },
  // Enable ESM support for tests
  define: {
    'import.meta.env': '{}'
  },
  // Configure for ESM
  optimizeDeps: {
    include: ['effect', 'react', 'ink', 'ink-spinner', 'ink-text-input', 'ink-select-input', 'pastel', 'ink-testing-library']
  }
})
