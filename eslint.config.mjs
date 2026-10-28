import domenicConfig from "@domenic/eslint-config";
import domenicStylisticConfig from "@domenic/eslint-config/stylistic";
import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
  },
  ...domenicConfig,
  ...domenicStylisticConfig,
  {
    files: ["**/*.js"],
    rules: {
      "new-cap": "off",
    },
  },
  {
    files: ["test/**.js"],
    rules: {
      "func-style": "off",
    },
  },
];
