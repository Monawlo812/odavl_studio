// odavl_studio/examples/golden-repo/eslint.config.js
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import unused from 'eslint-plugin-unused-imports';

export default [
  { ignores: ['dist/'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: { 
      parser: tsParser, 
      sourceType: 'module', 
      ecmaVersion: 2022,
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
    plugins: { '@typescript-eslint': tsPlugin, 'unused-imports': unused },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }]
    }
  }
];