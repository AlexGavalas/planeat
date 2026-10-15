import { describe, it } from 'node:test';
import { RuleTester } from 'oxlint/plugins-dev';

import { arrowFunctionExpressions } from './lint-rules.mts';

RuleTester.describe = describe;
RuleTester.it = it;

new RuleTester().run('arrow-function-expressions', arrowFunctionExpressions, {
    invalid: [
        {
            code: 'const value = function () { return 1; };',
            errors: [{ messageId: 'useArrow' }],
        },
        {
            code: 'const value = function named() { return 1; };',
            errors: [{ messageId: 'useArrow' }],
        },
        {
            code: '[1].map(function (value) { return value; });',
            errors: [{ messageId: 'useArrow' }],
        },
        {
            code: 'const object = { method() { return 1; } };',
            errors: [{ messageId: 'useArrow' }],
        },
    ],
    valid: [
        'const value = () => 1;',
        '[1].map((value) => value);',
        'class Failure extends Error { constructor() { super(); } }',
        'class Service { method() { return 1; } }',
        'const object = { get value() { return 1; }, set value(value) {} };',
        'const values = function* () { yield 1; };',
    ],
});
