import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import jsdoc from "eslint-plugin-jsdoc";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "*.min.js", "coverage/**"]
  },
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      jsdoc
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 2022,
      sourceType: "module"
    },
    rules: {
      // Catch common typos and reference errors
      "no-undef": "error",
      "no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "no-undefined-property": "off",

      // Method case sensitivity
      "dot-notation": "error",

      // JSDoc validation
      "jsdoc/check-param-names": "error",
      "jsdoc/check-property-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/require-param": "warn",
      "jsdoc/require-param-type": "warn",
      "jsdoc/require-returns": "warn",
      "jsdoc/require-returns-type": "warn",
      "jsdoc/valid-types": "error",

      // Prevent common errors
      "no-unreachable": "error",
      "no-constant-condition": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "constructor-super": "error",
      "no-this-before-super": "error",
      "no-class-assign": "error",
      "no-const-assign": "error"
    }
  }
]);
