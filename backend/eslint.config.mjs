import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default defineConfig([
  {
    ignores: ["node_modules/", "dist/"],
  },
  { files: ["src/**/*.{js,ts,jsx,tsx}", "tests/**/*.{js,ts,jsx,tsx}"] },
  { files: ["**/*.{js,ts}"], languageOptions: { sourceType: "module" } },
  {
    files: ["src/**/*.{js,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended", prettier],
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
    },
  },
  {
    languageOptions: { globals: globals.node },
  },
  ...tseslint.configs.recommended,
]);
