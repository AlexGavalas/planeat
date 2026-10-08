import { renderWithUser, screen } from '~test/utils';

import { NameAvatar } from './name-avatar';

describe('<NameAvatar />', () => {
    it('renders initials from the first and last name', () => {
        renderWithUser(<NameAvatar name="Test Example User" />);

        expect(
            screen.getByRole('img', { name: 'Test Example User' }),
        ).toBeInTheDocument();
        expect(screen.getByText('TU')).toBeInTheDocument();
    });

    it('renders a single initial for a single name', () => {
        renderWithUser(<NameAvatar name="Test" />);

        expect(screen.getByText('T')).toBeInTheDocument();
    });
});
