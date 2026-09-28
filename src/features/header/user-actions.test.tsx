import { signIn } from 'next-auth/react';
import mockRouter from 'next-router-mock';

import { renderWithUser, screen } from '~test/utils';

import { UserActions } from './user-actions';

jest.mock<typeof import('next-auth/react')>('next-auth/react', () => {
    const actual =
        jest.requireActual<typeof import('next-auth/react')>('next-auth/react');

    return { ...actual, signIn: jest.fn() };
});

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

describe('<UserActions />', () => {
    const mockSignIn = jest.mocked(signIn);

    beforeEach(() => {
        mockRouter.setCurrentUrl('/');
        mockSignIn.mockResolvedValue({
            error: null,
            ok: true,
            status: 200,
            url: 'https://production.example.com/home',
        });
    });

    it('opens a login modal with Google and email options', async () => {
        expect.assertions(3);
        const { user } = renderWithUser(<UserActions hasUser={false} />);

        await user.click(screen.getByRole('button', { name: 'Log in' }));

        expect(
            screen.getByRole('button', { name: 'Continue with Google' }),
        ).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('submits email and password credentials', async () => {
        expect.assertions(2);
        const { user } = renderWithUser(<UserActions hasUser={false} />);

        await user.click(screen.getByRole('button', { name: 'Log in' }));
        await user.type(screen.getByLabelText('Email'), 'USER@example.com');
        await user.type(screen.getByLabelText('Password'), 'password123');
        await user.click(
            screen.getByRole('button', { name: 'Log in with email' }),
        );

        expect(mockSignIn).toHaveBeenCalledWith('credentials', {
            callbackUrl: '/home',
            email: 'USER@example.com',
            password: 'password123',
            redirect: false,
        });
        expect(mockRouter.asPath).toBe('/home');
    });
});
