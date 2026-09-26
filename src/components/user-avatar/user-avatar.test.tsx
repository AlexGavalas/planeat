import { useProfile } from '~hooks/use-profile';
import { renderWithUser, screen } from '~test/utils';

import { UserAvatar } from './user-avatar';

jest.mock('~hooks/use-profile');

describe('<UserAvatar />', () => {
    const defaultProfile = {
        deleteProfile: jest.fn(),
        isDeleting: false,
        isFetching: false,
        profile: undefined,
        updateProfile: jest.fn(),
        user: undefined,
    } satisfies ReturnType<typeof useProfile>;

    describe('when the user is not logged in', () => {
        beforeAll(() => {
            jest.mocked(useProfile).mockReturnValue({
                ...defaultProfile,
                user: undefined,
            });
        });

        it('does not render', () => {
            renderWithUser(<UserAvatar />);

            expect(screen.queryByRole('img')).toBeNull();
        });
    });

    describe('when the user has no image', () => {
        beforeAll(() => {
            jest.mocked(useProfile).mockReturnValue({
                ...defaultProfile,
                user: { image: undefined, name: 'Test User' },
            });
        });

        it('renders the user initials', () => {
            renderWithUser(<UserAvatar />);

            expect(
                screen.getByRole('img', { name: 'Test User' }),
            ).toBeInTheDocument();
            expect(screen.getByText('TU')).toBeInTheDocument();
        });
    });

    describe('when the user has an image but no name', () => {
        beforeAll(() => {
            jest.mocked(useProfile).mockReturnValue({
                ...defaultProfile,
                user: { image: 'http://planeat/image', name: undefined },
            });
        });

        it('renders the image with a generic description', () => {
            renderWithUser(<UserAvatar />);

            expect(
                screen.getByRole('img', { name: 'User avatar' }),
            ).toBeInTheDocument();
        });
    });

    describe('when the user has neither an image nor usable initials', () => {
        beforeAll(() => {
            jest.mocked(useProfile).mockReturnValue({
                ...defaultProfile,
                user: { image: null, name: '   ' },
            });
        });

        it('renders the generic empty avatar', () => {
            renderWithUser(<UserAvatar />);

            expect(
                screen.getByRole('img', { name: 'User avatar' }),
            ).toBeInTheDocument();
        });
    });

    describe('when the user is logged in', () => {
        beforeAll(() => {
            jest.mocked(useProfile).mockReturnValue({
                ...defaultProfile,
                user: { image: 'http://planeat/image', name: 'Test User' },
            });
        });

        it('render the avatar', () => {
            const { container } = renderWithUser(<UserAvatar />);

            expect(screen.getByRole('img')).toBeInTheDocument();
            expect(container).toMatchSnapshot();
        });
    });
});
