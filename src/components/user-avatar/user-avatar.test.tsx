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

        it('does not render', () => {
            renderWithUser(<UserAvatar />);

            expect(screen.queryByRole('img')).toBeNull();
        });
    });

    describe('when the user has no name', () => {
        beforeAll(() => {
            jest.mocked(useProfile).mockReturnValue({
                ...defaultProfile,
                user: { image: 'http://planeat/image', name: undefined },
            });
        });

        it('does not render', () => {
            renderWithUser(<UserAvatar />);

            expect(screen.queryByRole('img')).toBeNull();
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

            expect(screen.queryByRole('img')).toBeInTheDocument();
            expect(container).toMatchSnapshot();
        });
    });
});
