import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...js.configs.recommended.globals,
        ...tseslint.configs.recommended.globals,
        fetch: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        window: 'readonly',
        NodeJS: 'readonly',
        clearTimeout: 'readonly',
        setTimeout: 'readonly',
        document: 'readonly',
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },
  {
    // Ignore test files
    ignores: ['**/*.test.ts', '**/*.test.tsx'],
  }
];