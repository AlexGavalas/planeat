import { MantineProvider } from '@mantine/core';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';

import testI18n from '~test/i18n';

type RenderParameters = Parameters<typeof render>;

export const renderWithUser = (renderParams: RenderParameters[0]) => {
    return {
        user: userEvent.setup(),
        ...render(renderParams, {
            wrapper: ({ children }) => (
                <I18nextProvider i18n={testI18n}>
                    <MantineProvider>{children}</MantineProvider>
                </I18nextProvider>
            ),
        }),
    };
};
