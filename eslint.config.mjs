import globals from "globals";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import eslintPlugin from "eslint-plugin-prettier/recommended";
import queryPlugin from "@tanstack/eslint-plugin-query";

export default [
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  eslintPlugin,
  ...queryPlugin.configs["flat/recommended"],
  {
    files: ["**/*.js", "**/*.jsx"],

    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },

      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "prettier/prettier": ["error"],
      "react/prop-types": 0,

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
];
