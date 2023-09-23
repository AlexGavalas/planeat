import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from 'react-query';

import { renderWithUser } from '~test/utils';

import { Fab } from './fab';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('<Fab />', () => {
    it('renders initially closed', () => {
        const { container } = renderWithUser(<Fab />, {
            Wrapper: ({ children }) => (
                <QueryClientProvider client={new QueryClient()}>
                    <ModalsProvider>{children}</ModalsProvider>
                </QueryClientProvider>
            ),
        });

        expect(container).toMatchSnapshot();
    });
});
