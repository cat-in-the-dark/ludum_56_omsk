import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    // workaround for vite in dev mode, otherwise wasm files will not be accessible from browser
    // though in prod build everything works.
    exclude: ["@cat_in_the_dark/raylib-wasm"],
  }
});
