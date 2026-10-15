import { renderWithUser, screen } from '~test/utils';

import { Nav } from './nav';

describe('<Nav />', () => {
    it('renders', () => {
        renderWithUser(<Nav />);

        expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
            'href',
            '/home',
        );
        expect(screen.getByRole('link', { name: 'Meal plan' })).toHaveAttribute(
            'href',
            '/meal-plan',
        );
        expect(
            screen.getByRole('link', { name: 'Connections' }),
        ).toHaveAttribute('href', '/connections');
    });
});
