import { renderWithUser } from '~test/utils';

import { Nav } from './nav';

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

describe('<Nav />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<Nav />);

        expect(container).toMatchSnapshot();
    });
});
