import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { standardCssModules } from "vite-plugin-standard-css-modules";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src/", import.meta.url)),
    },
  },
  plugins: [
    // TODO: https://github.com/vitejs/vite/issues/17700
    standardCssModules({
      include: ["**/*.module.css"],
    }),
  ],
});
