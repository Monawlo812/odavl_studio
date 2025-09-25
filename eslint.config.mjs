import js from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: ["src/**/*.ts", "packages/**/*.ts", "sandbox/**/*.js"],
    ignores: ["dist/**", "reports/**", "node_modules/**"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "error",
      "eqeqeq": "error"
    }
  }
];
