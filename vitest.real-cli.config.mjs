import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["__tests__/integration/cli-execution-real.test.ts"],
    setupFiles: ["__tests__/setup.ts"],
    testTimeout: 15_000, // 15 second timeout for tests
  },
  esbuild: {
    target: "node20",
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    alias: {
      "effect-cli-tui":
        "/Users/paul/Projects/Published/effect-cli-tui/dist/index.js",
    },
  },
  define: {
    "import.meta.env": "{}",
  },
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
