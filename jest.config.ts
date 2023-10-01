import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const config: Config = {
    clearMocks: true,

    collectCoverage: false,
    collectCoverageFrom: [
        'src/{components,features,hooks}/**/*.{ts,tsx}',
        '!**/index.ts',
    ],
    coverageReporters: ['text'],

    coverageThreshold: {
        global: {
            branches: 80,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },

    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths),
        '\\.css$': 'identity-obj-proxy',
    },
    modulePaths: [compilerOptions.baseUrl],

    roots: ['<rootDir>'],

    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

    testEnvironment: 'jsdom',

    testPathIgnorePatterns: ['./e2e/'],

    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                isolatedModules: true,
                tsconfig: './tsconfig.test.json',
            },
        ],
    },
};

export default config;
