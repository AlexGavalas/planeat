import { renderWithUser, screen } from '~test/utils';

import { CopyButton } from './copy-button';

describe('<CopyButton />', () => {
    it('renders the button', () => {
        const { container } = renderWithUser(<CopyButton value="test" />);

        expect(container).toMatchSnapshot();
    });

    describe('when the user hovers the button', () => {
        it('shows the tooltip', async () => {
            expect.hasAssertions();

            const { user, baseElement } = renderWithUser(
                <CopyButton value="test" />,
            );

            const button = screen.getByRole('button');

            await user.hover(button);

            expect(baseElement).toMatchSnapshot();
        });
    });

    describe('when user clicks the button', () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('copies the value to the clipboard', async () => {
            expect.hasAssertions();

            const writeText = jest.spyOn(navigator.clipboard, 'writeText');

            const { user } = renderWithUser(<CopyButton value="test" />);

            const button = screen.getByRole('button');

            await user.click(button);

            expect(writeText).toHaveBeenCalledWith('test');
        });
    });
});
