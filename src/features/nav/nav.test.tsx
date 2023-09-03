import { renderWithUser } from '~test/utils';

import { Nav } from './nav';

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('<Nav />', () => {
    it('renders', () => {
        const { container } = renderWithUser(<Nav />);

        expect(container).toMatchSnapshot();
    });
});
