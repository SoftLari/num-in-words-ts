import { defineConfig } from "vite";
import { resolve } from "path";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "NumInWordsTs",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: [],
      output: {
        exports: "named",
        globals: {},
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
      outDir: "dist",
    }),
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
});
