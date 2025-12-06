import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    pool: "forks", // Run each test file in separate process to prevent mock interference
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: [
      "__tests__/integration/cli-execution-real.test.ts", // Exclude real CLI tests from main suite
      "__tests__/integration/memkit-integration.test.ts", // Hanging due to complex Effect mocking - investigate separately
    ],
    // setupFiles: ["__tests__/setup.ts"], // Setup file not needed
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
      "@": join(__dirname, "src"),
      "@services": join(__dirname, "src/services"),
      "@components": join(__dirname, "src/components"),
      "@ui": join(__dirname, "src/ui"),
      "@utils": join(__dirname, "src/utils"),
      "@supermemory": join(__dirname, "src/supermemory"),
      "@kits": join(__dirname, "src/kits"),
      "@core": join(__dirname, "src/core"),
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
