import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["__tests__/integration/cli-execution-real.test.ts"], // Exclude real CLI tests from main suite
    setupFiles: ["__tests__/setup.ts"],
    testTimeout: 15_000, // 15 second timeout for tests (allows CLI commands with 10s timeout)
    // coverage: {
    //   provider: 'v8',
    //   reporter: ['text', 'json', 'html'],
    //   exclude: ['node_modules/', '__tests__/']
    // }
  },
  esbuild: {
    target: "node20",
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    alias: {
      "effect-cli-tui": join(__dirname, "dist/index.js"),
    },
  },
  // Enable ESM support for tests
  define: {
    "import.meta.env": "{}",
  },
  // Configure for ESM
  optimizeDeps: {
    include: [
      "effect",
      "react",
      "ink",
      "ink-spinner",
      "ink-text-input",
      "ink-select-input",
      "pastel",
      "ink-testing-library",
    ],
  },
});
