import { renderWithUser } from '~test/utils';

import { Card } from './card';

describe('<Card />', () => {
    it('renders with content', () => {
        const { container } = renderWithUser(<Card>Card content</Card>);

        expect(container).toMatchSnapshot();
    });
});
