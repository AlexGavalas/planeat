import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';

import { DEFAULT_MEAL_ZONE_TIMES } from '~constants/calendar';
import { useMealZoneTimes } from '~hooks/use-meal-zone-times';
import { renderWithUser, screen, waitFor } from '~test/utils';

import { saveMealZoneTimes } from '../../app/actions';
import { MealZoneSettings } from './meal-zone-settings';

jest.mock<typeof import('~hooks/use-meal-zone-times')>(
    '~hooks/use-meal-zone-times',
    () => ({
        useMealZoneTimes: jest.fn(),
    }),
);
jest.mock<
    Pick<
        typeof import('~util/notification'),
        'showErrorNotification' | 'showSuccessNotification'
    >
>('~util/notification', () => ({
    showErrorNotification: jest.fn(),
    showSuccessNotification: jest.fn(),
}));

describe('meal zone settings', () => {
    it('captures a changed native time value before saving', async () => {
        expect.hasAssertions();

        jest.mocked(useMealZoneTimes).mockReturnValue({
            effectiveFrom: '2026-10-12',
            isFetching: false,
            times: DEFAULT_MEAL_ZONE_TIMES,
        });
        jest.mocked(saveMealZoneTimes).mockResolvedValue({
            effectiveFrom: '2026-10-12',
            ok: true,
        });

        const client = new QueryClient({
            defaultOptions: { mutations: { retry: false } },
        });
        const Wrapper = ({ children }: PropsWithChildren) => (
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        );
        const { user } = renderWithUser(<MealZoneSettings />, { Wrapper });

        const morningInput = screen.getByLabelText('Morning');
        await user.clear(morningInput);
        await user.type(morningInput, '08:30');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => {
            expect(saveMealZoneTimes).toHaveBeenCalledWith({
                times: {
                    ...DEFAULT_MEAL_ZONE_TIMES,
                    morning: '08:30',
                },
            });
        });

        client.clear();
    });
});
