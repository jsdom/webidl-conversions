import domenicConfig from "@domenic/eslint-config";
import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node
    }
  },
  ...domenicConfig,
  {
    files: ["**/*.js"],
    rules: {
      "new-cap": "off"
    }
  },
  {
    files: ["test/**.js"],
    languageOptions: {
      globals: { ...globals.mocha, ...globals.node }
    },
    rules: {
      "no-empty-function": "off",
      "func-style": "off"
    }
  }
];
