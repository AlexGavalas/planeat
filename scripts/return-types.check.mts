import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import config from '../.oxlintrc.json' with { type: 'json' };

const directory = mkdtempSync(join(tmpdir(), 'habitthread-return-types-'));
const configPath = join(directory, 'oxlint.json');
const oxlintPath = fileURLToPath(
    new URL('../node_modules/oxlint/bin/oxlint', import.meta.url),
);

writeFileSync(
    configPath,
    JSON.stringify({
        categories: { correctness: 'off' },
        plugins: ['typescript'],
        rules: {
            'typescript/explicit-function-return-type':
                config.rules['typescript/explicit-function-return-type'],
            'typescript/no-restricted-types':
                config.rules['typescript/no-restricted-types'],
        },
    }),
);

after(() => {
    rmSync(directory, { force: true, recursive: true });
});

const cases = [
    {
        code: 'export const ids = [1, 2].map((value) => value * 2);',
        name: 'allows inferred map callbacks',
        status: 0,
    },
    {
        code: 'export const found = [1, 2].find((value) => value === 2);',
        name: 'allows inferred find predicates',
        status: 0,
    },
    {
        code: 'export const sorted = [2, 1].sort((a, b) => a - b);',
        name: 'allows inferred sort comparators',
        status: 0,
    },
    {
        code: "jest.mock('session', () => ({ getCurrentUser: jest.fn(), getRequestDate: jest.fn() }));",
        name: 'allows inferred Jest mock factories',
        status: 0,
    },
    {
        code: "it('rejects malformed input', async () => { await Promise.resolve(); });",
        name: 'allows inferred async test callbacks',
        status: 0,
    },
    {
        code: "describe('session', () => { beforeEach(() => {}); it('loads', () => {}); });",
        name: 'allows inferred suite and lifecycle callbacks',
        status: 0,
    },
    {
        code: "import { expect, type Page } from '@playwright/test'; declare const page: Page; void expect(page).toHaveURL((url) => url.pathname === '/home');",
        name: 'allows Playwright URL predicates',
        status: 0,
    },
    {
        code: "import { type Page } from '@playwright/test'; declare const page: Page; void page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);",
        name: 'allows Playwright evaluate callbacks',
        status: 0,
    },
    {
        code: "import { type Page } from '@playwright/test'; declare const page: Page; void page.waitForResponse((response) => response.status() === 200);",
        name: 'allows Playwright response predicates',
        status: 0,
    },
    {
        code: 'export const project: (value: number) => number = (value) => value * 2;',
        name: 'allows expressions assigned an explicit function type',
        status: 0,
    },
    {
        code: 'export const handlers: { onClick: () => void } = { onClick: () => {} };',
        name: 'allows contextually typed event handlers',
        status: 0,
    },
    {
        code: 'export const pairs = [1, 2].map((value): [number, number] => [value, value]);',
        name: 'allows explicit tuple contracts when inference needs them',
        status: 0,
    },
    {
        code: 'export const getValue = () => 1;',
        name: 'requires standalone utility return types',
        status: 1,
    },
    {
        code: 'export const useValue = () => 1;',
        name: 'requires standalone hook return types',
        status: 1,
    },
    {
        code: 'export const Component = () => <div />;',
        name: 'requires standalone component return types',
        status: 1,
    },
    {
        code: "import type { ReactElement } from 'react'; export const Component = (): ReactElement => <div />;",
        name: 'allows ReactElement component contracts',
        status: 0,
    },
    {
        code: "import type { ReactElement } from 'react'; export const Component = (): ReactElement | null => null;",
        name: 'allows nullable ReactElement contracts',
        status: 0,
    },
    {
        code: "import type { ReactElement } from 'react'; export const Component = async (): Promise<ReactElement> => <div />;",
        name: 'allows async ReactElement contracts',
        status: 0,
    },
    {
        code: "import type { JSX } from 'react'; export const Component = (): JSX.Element => <div />;",
        message: /Use ReactElement imported from react instead/,
        name: 'rejects JSX.Element component contracts',
        status: 1,
    },
    {
        code: "import type * as React from 'react'; export const Component = (): React.JSX.Element => <div />;",
        message: /Use ReactElement imported from react instead/,
        name: 'rejects React.JSX.Element component contracts',
        status: 1,
    },
];

await describe('return-type configuration', () => {
    for (const [index, fixture] of cases.entries()) {
        void it(fixture.name, () => {
            const file = join(directory, `fixture-${index}.tsx`);
            writeFileSync(file, fixture.code);
            const result = spawnSync(
                process.execPath,
                [oxlintPath, '--config', configPath, file],
                { encoding: 'utf8' },
            );

            assert.ifError(result.error);
            assert.equal(
                result.status,
                fixture.status,
                result.stdout + result.stderr,
            );
            if (fixture.status === 1) {
                assert.match(
                    result.stdout,
                    fixture.message ?? /Missing return type on function/,
                );
            }
        });
    }
});
