import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type NextRouter } from 'next/router';
import { type PropsWithChildren } from 'react';

import { renderWithUser } from '~test/utils';

import { Fab } from './fab';

jest.mock<NextRouter>('next/router', () =>
    jest.requireActual<NextRouter>('next-router-mock'),
);

describe('<Fab />', () => {
    it('renders initially closed', () => {
        const { container } = renderWithUser(<Fab />, {
            Wrapper: ({ children }: PropsWithChildren) => (
                <QueryClientProvider client={new QueryClient()}>
                    <ModalsProvider>{children}</ModalsProvider>
                </QueryClientProvider>
            ),
        });

        expect(container).toMatchSnapshot();
    });
});
