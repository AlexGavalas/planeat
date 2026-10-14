import { Provider, createStore } from 'jotai';
import { type PropsWithChildren } from 'react';

import { currentWeekAtom, unsavedChangesAtom } from '~store/atoms';
import { act, renderHook } from '~test/utils';
import { type Meal } from '~types/meal';
import { type WeeklyMealZone } from '~types/meal-zone';

import { saveWeeklyMealSchedule } from '../../app/weekly-meal-zone-actions';
import { useWeeklyScheduleOps } from './weekly-schedule';

describe('useWeeklyScheduleOps', () => {
    it('copies the current schedule and meals into the following week', async () => {
        expect.hasAssertions();
        const store = createStore();
        store.set(currentWeekAtom, new Date('2024-01-01T12:00:00Z'));

        const Wrapper = ({ children }: PropsWithChildren): React.ReactNode => (
            <Provider store={store}>{children}</Provider>
        );

        const zones: WeeklyMealZone[] = [
            {
                day: '2024-01-01',
                label: 'Breakfast',
                legacyKey: 'morning',
                position: 0,
                time: '08:00',
                weekStart: '2024-01-01',
                zoneKey: 'Breakfast_Mon 01/01/2024',
            },
            {
                day: '2024-01-02',
                label: 'Custom meal',
                position: 0,
                time: '10:00',
                weekStart: '2024-01-01',
                zoneKey: 'custom-zone-id',
            },
        ];
        const { result } = renderHook(() => useWeeklyScheduleOps(zones), {
            wrapper: Wrapper,
        });
        const meal: Meal = {
            day: '2024-01-01 08:00',
            id: '10accc9d-f0b7-4225-87df-3e91d5639d75',
            meal: 'Greek yogurt and fruit',
            note: 'Add honey',
            rating: 4,
            section_key: 'Breakfast_Mon 01/01/2024',
            user_id: 7,
        };

        await act(async () => {
            await result.current.copyToNextWeek([meal]);
        });

        expect(jest.mocked(saveWeeklyMealSchedule)).toHaveBeenCalledWith(
            expect.objectContaining({
                weekStart: '2024-01-08',
                zones: [
                    expect.objectContaining({
                        day: '2024-01-08',
                        zoneKey: 'Breakfast_Mon 08/01/2024',
                    }),
                    expect.objectContaining({
                        day: '2024-01-09',
                        zoneKey: 'custom-zone-id',
                    }),
                ],
            }),
        );

        expect(store.get(currentWeekAtom)).toStrictEqual(
            new Date('2024-01-08T12:00:00Z'),
        );
        expect(store.get(unsavedChangesAtom)).toStrictEqual({
            anonymous: {
                'Breakfast_Mon 08/01/2024': {
                    day: '2024-01-08',
                    meal: 'Greek yogurt and fruit',
                    note: 'Add honey',
                    rating: 4,
                    section_key: 'Breakfast_Mon 08/01/2024',
                    user_id: 7,
                },
            },
        });
    });
});
