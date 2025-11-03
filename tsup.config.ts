import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { extension: '.d.ts' },
  sourcemap: true,
  clean: true,
  outExtension: ({ format }) => ({
    js: '.js',
    dts: '.d.ts',
  }),
  external: ['effect', 'react', 'ink'],
});
