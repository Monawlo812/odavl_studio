import js from "@eslint/js";
import globals from "globals";

// --- BEGIN orchestrator ESLint scope ---
const orchestratorScope = {
  files: ["packages/org-orchestrator/**/*.{ts,tsx}"],
  languageOptions: {
    parser: (await import("@typescript-eslint/parser")).default,
    parserOptions: {
      project: "./packages/org-orchestrator/tsconfig.json",
      tsconfigRootDir: import.meta.dirname,
      ecmaVersion: "latest",
      sourceType: "module"
    },
    ecmaVersion: "latest",
    sourceType: "module",
    globals: { ...globals.node }
  },
  rules: {
    // keep default rules; do not relax safety gates here
  }
};

// --- BEGIN orchestrator (apps) ESLint scope ---
const orchestratorAppScope = {
  files: ["apps/orchestrator/**/*.{ts,tsx}"],
  languageOptions: {
    parser: (await import("@typescript-eslint/parser")).default,
    parserOptions: {
      project: "./apps/orchestrator/tsconfig.json",
      tsconfigRootDir: import.meta.dirname,
      ecmaVersion: "latest",
      sourceType: "module"
    },
    ecmaVersion: "latest",
    sourceType: "module",
    globals: { ...globals.node }
  },
  rules: {
    // keep default rules; do not relax safety gates here
  }
};
// --- END orchestrator (apps) ESLint scope ---

const orchestratorTestOverride = {
  files: ["packages/org-orchestrator/**/*.spec.ts"],
  languageOptions: {
    globals: { ...globals.jest }
  }
};
const globalIgnores = {
  ignores: ["**/node_modules/**", "**/dist/**", "**/coverage/**", "reports/**"]
};
// --- END orchestrator ESLint scope ---

export default [
  globalIgnores,
  {
    files: ["src/**/*.ts", "packages/**/*.ts"],
    ignores: ["dist/**", "reports/**", "node_modules/**"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "eqeqeq": "error"
    }
  },
  orchestratorScope,
  orchestratorAppScope,
  orchestratorTestOverride
];
