import js from "@eslint/js";
import jest from "eslint-plugin-jest";

/**
 * ESLint 9+ flat config for ESM, Jest, and ignore patterns.
 * - Enables recommended JS rules
 * - Enables Jest plugin and globals for test files
 * - Ignores build, node_modules, and dist
 */
export default [
  js.configs.recommended,
  {
    files: [
      "**/*.test.ts",
      "**/*.test.js",
      "**/__tests__/**/*.ts",
      "**/__tests__/**/*.js",
    ],
    plugins: { jest },
    languageOptions: {
      globals: jest.environments.env.globals,
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "*.d.ts",
      "*.js",
      "*.cjs",
      "*.mjs",
      "*.json",
      "*.md",
      "out/",
      "reports/",
    ],
  },
];
