import { renderWithUser, screen } from '~test/utils';

import { Card } from './card';

describe('<Card />', () => {
    it('renders with content', () => {
        renderWithUser(<Card>Card content</Card>);

        expect(screen.getByText('Card content')).toBeVisible();
    });
});
