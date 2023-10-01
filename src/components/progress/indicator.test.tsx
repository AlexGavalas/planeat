import { renderWithUser } from '~test/utils';

import { ProgressIndicator } from './indicator';

describe('<ProgressIndicator />', () => {
    it('renders the sections', () => {
        const { container } = renderWithUser(
            <ProgressIndicator
                label="Test"
                percent={50}
                sections={[
                    {
                        key: 'test',
                        label: 'Test',
                        percent: 50,
                        bg: 'blue',
                    },
                ]}
                value={50}
            />,
        );

        expect(container).toMatchSnapshot();
    });
});
