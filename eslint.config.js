import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig(
    {
        ignores: ['eslint.config.js'],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      plugins: {
        "simple-import-sort": simpleImportSort,
      },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'commonjs',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': "off",
            'prettier/prettier': ['error', { endOfLine: 'auto' }],
            'object-curly-newline': [
                'error',
                {
                    "ObjectExpression": { "multiline": true, "minProperties": 2, "consistent": true },
                    "ObjectPattern": { "multiline": true, "minProperties": 2, "consistent": true },
                    "ImportDeclaration": { "multiline": true, "consistent": true } 
                },
            ],
            'object-property-newline': [
                'error',
                {
                    allowAllPropertiesOnSameLine: false,
                },
            ],
            "simple-import-sort/imports": [
            "error",
                {
                    "groups": [
                        ["^"],       // 1. Внешние пакеты и библиотеки (npm)
                        ["^\\."],    // 2. Локальные (относительные) импорты
                        ["^.*css"]   // 3. Файлы стилей (CSS/SCSS)
                    ]
                }
            ],
            "simple-import-sort/exports": "error",
        },
    },
    eslintConfigPrettier
);
