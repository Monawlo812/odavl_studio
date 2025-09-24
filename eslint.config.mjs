import js from "@eslint/js";

export default [
  {
    files: ["src/**/*.ts", "packages/**/*.ts"],
    ignores: ["dist/**", "reports/**", "node_modules/**"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module" },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "eqeqeq": "error"
    }
  }
];
