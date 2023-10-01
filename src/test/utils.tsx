import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import { type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import { i18n } from '~test/i18n';

type RenderParameters = Parameters<typeof render>;

export const renderWithUser = (
    renderParams: RenderParameters[0],
    {
        Wrapper = ({ children }) => <>{children}</>,
    }: { Wrapper?: RenderOptions['wrapper'] } = {},
) => {
    return {
        user: userEvent.setup(),
        ...render(renderParams, {
            wrapper: ({ children }) => (
                <I18nextProvider i18n={i18n}>
                    <MantineProvider>
                        <Wrapper>{children}</Wrapper>
                    </MantineProvider>
                </I18nextProvider>
            ),
        }),
    };
};

export * from '@testing-library/react';
