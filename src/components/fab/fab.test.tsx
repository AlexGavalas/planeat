import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

import { renderWithUser, screen } from '~test/utils';

import { Fab } from './fab';

jest.mock<typeof import('next/navigation')>('next/navigation', () => ({
    ...jest.requireActual<typeof import('next/navigation')>('next/navigation'),
    usePathname: () =>
        jest.requireActual<typeof import('next-router-mock')>(
            'next-router-mock',
        ).default.pathname,
    useRouter: () => ({
        back: jest.fn(),
        bfcacheId: 'test',
        forward: jest.fn(),
        prefetch: jest.fn(),
        push: (href: string) => {
            void jest
                .requireActual<typeof import('next-router-mock')>(
                    'next-router-mock',
                )
                .default.push(href);
        },
        refresh: jest.fn(),
        replace: jest.fn(),
    }),
}));

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
