import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },

  {
    ignores: ['dist', 'node_modules', 'eslint.config.js', '.eslintignore'],
  },
  {
    rules: {
      // For this repo, many pages/components may be partially stubbed.
      // Disable unused vars checks to avoid blocking builds with lint.
      'no-unused-vars': 'off',
    },
  },
];



