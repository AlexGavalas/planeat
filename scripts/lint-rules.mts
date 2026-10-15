import { type RuleTester } from 'oxlint/plugins-dev';

type Rule = Parameters<RuleTester['run']>[1];
type CreateRule = NonNullable<Rule['create']>;

// Native func-style enforces expressions, but still permits `const f = function`.
export const arrowFunctionExpressions: Rule = {
    create: (context): ReturnType<CreateRule> => ({
        FunctionExpression: (node): void => {
            // Constructors and class methods use method syntax; arrows cannot
            // implement generators. Other required exceptions need a local,
            // explained lint suppression, not an entire directory exemption.
            if (
                node.generator ||
                node.parent.type === 'MethodDefinition' ||
                (node.parent.type === 'Property' &&
                    (node.parent.kind === 'get' || node.parent.kind === 'set'))
            ) {
                return;
            }
            context.report({
                messageId: 'useArrow',
                node,
            });
        },
    }),
    meta: {
        messages: {
            useArrow:
                'Use an arrow function unless the language or framework requires otherwise.',
        },
        schema: [],
        type: 'suggestion',
    },
};

const plugin = {
    meta: { name: 'project' },
    rules: { 'arrow-function-expressions': arrowFunctionExpressions },
};

// oxlint-disable-next-line import/no-default-export -- Oxlint loads local plugins through their default export.
export default plugin;
