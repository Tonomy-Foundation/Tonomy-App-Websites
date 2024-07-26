import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import rheslint from "eslint-plugin-react-hooks";

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        plugins: {
            "react-hooks": rheslint,
        },
        rules: {
            eqeqeq: "error",
            "no-console": "warn",
            "prettier/prettier": "error",
            "react/display-name": "off",
            "react/no-children-prop": "off",
            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "padding-line-between-statements": [
                "warn",
                { blankLine: "always", prev: "block-like", next: "*" },
                { blankLine: "always", prev: "block", next: "*" },
                { blankLine: "always", prev: "*", next: ["block", "block-like"] },
                { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
                {
                    blankLine: "any",
                    prev: ["const", "let", "var"],
                    next: ["const", "let", "var"],
                },
                { blankLine: "always", prev: ["export", "import"], next: "*" },
                { blankLine: "any", prev: "import", next: "import" },
                { blankLine: "any", prev: "export", next: "export" },
            ],
        },
        languageOptions: {
            ecmaVersion: 6,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.jest,
            },
        },
        files: ["**/*.js", "**/*.ts"],
        ignores: ["build/**"],
    },
];
