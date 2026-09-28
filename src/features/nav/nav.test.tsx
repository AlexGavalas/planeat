import { renderWithUser } from '~test/utils';

import { Nav } from './nav';

describe('<Nav />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<Nav />);

        expect(container).toMatchSnapshot();
    });
});
