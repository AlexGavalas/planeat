import jest from 'eslint-plugin-jest';
import testingLibrary from 'eslint-plugin-testing-library';

export const jestTestConfig = {
    ...jest.configs['flat/recommended'],
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
        ...jest.configs['flat/recommended'].rules,
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        'jest/consistent-test-it': ['error', { fn: 'it' }],
        'jest/max-expects': ['warn', { max: 3 }],
        'jest/max-nested-describe': ['error', { max: 3 }],
        'jest/no-conditional-in-test': 'error',
        'jest/no-confusing-set-timeout': 'error',
        'jest/no-duplicate-hooks': 'error',
        'jest/no-test-return-statement': 'error',
        'jest/no-untyped-mock-factory': 'off',
        'jest/prefer-called-with': 'warn',
        'jest/prefer-comparison-matcher': 'error',
        'jest/prefer-equality-matcher': 'error',
        'jest/prefer-expect-assertions': [
            'warn',
            { onlyFunctionsWithAsyncKeyword: true },
        ],
        'jest/prefer-expect-resolves': 'warn',
        'jest/prefer-hooks-in-order': 'error',
        'jest/prefer-hooks-on-top': 'error',
        'jest/prefer-lowercase-title': 'error',
        'jest/prefer-mock-promise-shorthand': 'error',
        'jest/prefer-spy-on': 'warn',
        'jest/prefer-strict-equal': 'error',
        'jest/require-hook': 'warn',
        'jest/require-to-throw-message': 'error',
        'jest/require-top-level-describe': 'error',
    },
};

export const testingLibraryTestConfig = {
    ...testingLibrary.configs['flat/react'],
    files: ['**/*.test.tsx'],
    rules: {
        ...testingLibrary.configs['flat/react'].rules,
        'testing-library/prefer-explicit-assert': [
            'error',
            {
                assertion: 'toBeInTheDocument',
                includeFindQueries: true,
            },
        ],
        'testing-library/prefer-user-event': 'error',
    },
};
