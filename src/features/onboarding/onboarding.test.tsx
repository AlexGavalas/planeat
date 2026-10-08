import { type Props as JoyrideProps } from 'react-joyride';

import { useLocalizedPath } from '~hooks/use-localized-path';
import { useProfile } from '~hooks/use-profile';
import { renderWithUser, waitFor } from '~test/utils';

import { Onboarding } from './onboarding';

const mockJoyride = jest.fn<null, [JoyrideProps]>(() => null);

jest.mock('react-joyride', () => {
    const actual =
        jest.requireActual<typeof import('react-joyride')>('react-joyride');

    return {
        ...actual,
        Joyride: (props: JoyrideProps) => mockJoyride(props),
    };
});

jest.mock('~hooks/use-localized-path');
jest.mock('~hooks/use-profile');

describe('<Onboarding />', () => {
    beforeEach(() => {
        jest.mocked(useLocalizedPath).mockReturnValue((path) => path);
        jest.mocked(useProfile).mockReturnValue({
            deleteProfile: jest.fn(),
            isDeleting: false,
            isFetching: false,
            profile: {
                created_at: '2026-10-03',
                email: 'user@example.test',
                food_preferences_negative: null,
                food_preferences_positive: null,
                full_name: 'Test User',
                has_completed_onboarding: false,
                height: null,
                id: 1,
                is_discoverable: false,
                language: 'en',
                professional_is_discoverable: false,
                roles: [],
                target_weight: null,
            },
            updateProfile: jest.fn(),
            user: {
                email: 'user@example.test',
                name: 'Test User',
            },
        });
    });

    it('waits for the current target before running the tour', async () => {
        expect.hasAssertions();

        renderWithUser(<Onboarding />);

        await waitFor(() => {
            expect(mockJoyride).toHaveBeenLastCalledWith(
                expect.objectContaining({ run: false }),
            );
        });

        const target = document.createElement('div');
        target.id = 'daily-meals-container';
        document.body.append(target);

        await waitFor(() => {
            expect(mockJoyride).toHaveBeenLastCalledWith(
                expect.objectContaining({ run: true }),
            );
        });
    });

    it('scrolls targets into the padded viewport', async () => {
        expect.hasAssertions();

        const target = document.createElement('div');
        target.id = 'daily-meals-container';
        document.body.append(target);

        renderWithUser(<Onboarding />);

        await waitFor(() => {
            expect(mockJoyride).toHaveBeenLastCalledWith({
                continuous: true,
                floatingOptions: { shiftOptions: { padding: 16 } },
                locale: expect.any(Object),
                onEvent: expect.any(Function),
                options: expect.objectContaining({ scrollOffset: 24 }),
                run: true,
                scrollToFirstStep: true,
                stepIndex: 0,
                steps: expect.any(Array),
                styles: expect.any(Object),
            });
        });
    });
});
