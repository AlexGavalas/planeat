import nextConfig from 'eslint-config-next';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

import {
    jestTestConfig,
    testingLibraryTestConfig,
} from './eslint.test-config.mjs';

export default defineConfig([
    ...nextConfig,
    ...nextTs,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    prettier,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                {
                    fixStyle: 'inline-type-imports',
                    prefer: 'type-imports',
                },
            ],
            '@typescript-eslint/explicit-function-return-type': 'warn',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    custom: {
                        match: true,
                        regex: '^[A-Z]\\w{1,}',
                    },
                    format: ['PascalCase'],
                    selector: 'typeParameter',
                },
                {
                    custom: {
                        match: true,
                        regex: '^[A-Z]\\w{1,}',
                    },
                    format: ['PascalCase'],
                    selector: 'typeLike',
                },
                {
                    format: ['PascalCase'],
                    prefix: ['is', 'should', 'has', 'can', 'did'],
                    selector: 'variable',
                    types: ['boolean'],
                },
            ],
            '@typescript-eslint/prefer-nullish-coalescing': [
                'error',
                { ignorePrimitives: true },
            ],
            '@typescript-eslint/no-deprecated': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/prefer-promise-reject-errors': 'off',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            curly: 'error',
            'import/no-default-export': 'error',
            'react-hooks/set-state-in-effect': 'off',
            'sort-keys': [
                'warn',
                'asc',
                { caseSensitive: true, minKeys: 2, natural: true },
            ],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        files: ['**/*.tsx'],
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            'react/boolean-prop-naming': [
                'error',
                { rule: '^(is|has)[A-Z]\\w+' },
            ],
            'react/button-has-type': 'error',
            'react/hook-use-state': ['error', { allowDestructuredState: true }],
            'react/jsx-boolean-value': 'error',
            'react/jsx-curly-newline': [
                'error',
                { multiline: 'consistent', singleline: 'consistent' },
            ],
            'react/jsx-handler-names': [
                'warn',
                {
                    checkInlineFunction: true,
                    checkLocalVariables: true,
                    eventHandlerPrefix: 'handle|set|reset|open|close|toggle|on',
                    eventHandlerPropPrefix: 'on',
                },
            ],
            'react/jsx-max-depth': ['warn', { max: 6 }],
            'react/jsx-no-bind': [
                'error',
                { allowArrowFunctions: true, ignoreDOMComponents: true },
            ],
            'react/jsx-no-useless-fragment': 'error',
            'react/jsx-sort-props': [
                'warn',
                {
                    ignoreCase: false,
                    reservedFirst: true,
                    shorthandFirst: true,
                },
            ],
            'react/no-unused-prop-types': 'error',
            'react/prefer-read-only-props': 'error',
            'react/void-dom-elements-no-children': 'error',
        },
    },
    {
        files: ['src/app/**/*', '*.config.*'],
        rules: {
            'import/no-default-export': 'off',
        },
    },
    {
        files: ['e2e/global.setup.ts'],
        rules: {
            'import/no-default-export': 'off',
        },
    },
    jestTestConfig,
    testingLibraryTestConfig,
    {
        files: ['**/*.d.ts'],
        rules: {
            '@typescript-eslint/consistent-type-definitions': 'off',
        },
    },
    globalIgnores([
        '.next/**',
        'coverage/**',
        'node_modules/**',
        'out/**',
        'build/**',
        'eslint.test-config.mjs',
        'next-env.d.ts',
        'public/sw.js',
        '*.config.js',
        '*.config.mjs',
    ]),
]);
