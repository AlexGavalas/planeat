import { renderWithUser, screen } from '~test/utils';

import { CopyButton } from './copy-button';

describe('<CopyButton />', () => {
    it('renders the button', () => {
        const { container } = renderWithUser(<CopyButton value="test" />);

        expect(container).toMatchSnapshot();
    });

    describe('when the user hovers the button', () => {});

    describe('when user clicks the button', () => {
        beforeAll(() => {
            jest.spyOn(navigator.clipboard, 'writeText');
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it('copies the value to the clipboard', async () => {
            const { user } = renderWithUser(<CopyButton value="test" />);

            const button = screen.getByRole('button');

            await user.click(button);

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test');
        });
    });
});
