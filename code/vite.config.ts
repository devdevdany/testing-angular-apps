/// <reference types="vitest" />
import angular from "@analogjs/vite-plugin-angular";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  test: {
    include: ["./src/**/*.{test,spec}.ts"],
    setupFiles: ["./tests/setup/setup-test-env.ts"],
    restoreMocks: true,
    coverage: {
      include: ["src/**/*.ts"],
      all: true,
    },
    reporters: ["default"],
    environment: "jsdom",
    globals: true,
    alias: [
      {
        find: /^@ng-web-apis\/common$/,
        replacement: "@ng-web-apis/common/fesm2015/ng-web-apis-common.js",
      },
      {
        find: /^@ng-web-apis\/geolocation$/,
        replacement:
          "@ng-web-apis/geolocation/fesm2015/ng-web-apis-geolocation.js",
      },
    ],
  },
  define: {
    "import.meta.vitest": mode !== "production",
  },
}));
