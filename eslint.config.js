import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginJest from 'eslint-plugin-jest';

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser },
  },

  {
    files: ['src/**.js', 'src/**/*.js'],
    rules: {
      semi: 'warn',
      'prefer-const': 'error',
      'no-console': 'warn',
      'no-alert': 'warn',
    },
  },
  eslintConfigPrettier,
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...eslintPluginJest.environments.globals.globals,
      },
    },
    plugins: {
      jest: eslintPluginJest,
    },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
    },
  },
]);
