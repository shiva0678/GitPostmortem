import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'backend']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // -----------------------------------------------------------------------
      // Code quality
      // -----------------------------------------------------------------------

      // Warn on console statements so they're intentional, not accidental.
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Catch declared-but-unused variables. Ignore vars prefixed with _ and
      // React itself (it's in scope via JSX transform but never referenced).
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],

      // Prevent importing the same module more than once.
      'no-duplicate-imports': 'error',

      // Catch accidental equality comparisons that should use ===.
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // No var declarations — use const/let.
      'no-var': 'error',

      // Prefer const where a variable is never reassigned.
      'prefer-const': ['error', { destructuring: 'any' }],

      // Disallow unreachable code after return/throw/break/continue.
      'no-unreachable': 'error',

      // Disallow empty block statements (catches forgotten stubs).
      'no-empty': ['error', { allowEmptyCatch: true }],

      // -----------------------------------------------------------------------
      // React / JSX
      // -----------------------------------------------------------------------

      // All existing react-hooks rules are inherited from the extended config.
      // Additional React-specific tweaks:

      // Downgrade purity from error → warn.
      // Math.random() inside useMemo(() => ..., []) is valid — it executes
      // exactly once on mount. The v7 rule is too strict for this pattern.
      'react-hooks/purity': 'warn',

      // Ensure all effect dependencies are declared.
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
])
