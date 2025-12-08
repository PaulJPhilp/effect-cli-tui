import { resolve } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components.ts",
    "src/theme.ts",
    "src/services.ts",
    "src/constants.ts",
  ],
  format: "esm",
  dts: true,
  sourcemap: true,
  clean: true,
  outExtension: () => ({
    js: ".js",
    dts: ".d.ts",
  }),
  external: [
    "effect",
    "react",
    "ink",
    "ink-spinner",
    "ink-text-input",
    "ink-select-input",
    "pastel",
  ],
  esbuildOptions(options) {
    options.alias = {
      "@": resolve(process.cwd(), "src"),
      "@services": resolve(process.cwd(), "src/services"),
      "@components": resolve(process.cwd(), "src/components"),
      "@ui": resolve(process.cwd(), "src/ui"),
      "@utils": resolve(process.cwd(), "src/utils"),
      "@supermemory": resolve(process.cwd(), "src/supermemory"),
      "@kits": resolve(process.cwd(), "src/kits"),
      "@core": resolve(process.cwd(), "src/core"),
    };
    options.jsx = "automatic";
    options.jsxImportSource = "react";
    return options;
  },
});
