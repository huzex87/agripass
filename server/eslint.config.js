const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  { ignores: ["node_modules", "dist"] },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
