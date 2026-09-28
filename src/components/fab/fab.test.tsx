import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

import { renderWithUser, screen } from '~test/utils';

import { Fab } from './fab';

describe('<Fab />', () => {
    it('renders initially closed', () => {
        renderWithUser(<Fab />, {
            Wrapper: ({ children }: PropsWithChildren) => (
                <QueryClientProvider client={new QueryClient()}>
                    <ModalsProvider>{children}</ModalsProvider>
                </QueryClientProvider>
            ),
        });

        expect(screen.getByRole('button')).toMatchSnapshot();
    });
});
