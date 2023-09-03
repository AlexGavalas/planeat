import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.json';

const config: Config = {
    clearMocks: true,

    collectCoverage: false,
    coverageReporters: ['text'],
    collectCoverageFrom: [
        'src/{components,features,hooks}/**/*.{ts,tsx}',
        '!**/index.ts',
    ],

    coverageThreshold: {
        global: {
            statements: 90,
            branches: 80,
            functions: 90,
            lines: 90,
        },
    },

    testEnvironment: 'jsdom',

    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: './tsconfig.test.json',
                isolatedModules: true,
            },
        ],
    },

    setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

    roots: ['<rootDir>'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths),
        '\\.css$': 'identity-obj-proxy',
    },
};

export default config;
