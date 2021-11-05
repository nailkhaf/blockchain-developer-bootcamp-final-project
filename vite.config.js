import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import replace from '@rollup/plugin-replace';

export default defineConfig({
  plugins: [
    solidPlugin(),
    replace({
      '"_SOLID_DEV_"': true,
    })
  ],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});
