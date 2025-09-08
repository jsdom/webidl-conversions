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
    rules: {
      "func-style": "off"
    }
  }
];
