import { Provider, createStore } from 'jotai';
import { type PropsWithChildren } from 'react';

import { currentWeekAtom, unsavedChangesAtom } from '~store/atoms';
import { act, renderHook } from '~test/utils';
import { type Meal } from '~types/meal';

import { useWeeklyScheduleOps } from './weekly-schedule';

describe('useWeeklyScheduleOps', () => {
    it('copies the current meals into the following week as new meals', () => {
        const store = createStore();
        store.set(currentWeekAtom, new Date('2024-01-01T12:00:00Z'));

        const Wrapper = ({ children }: PropsWithChildren): React.ReactNode => (
            <Provider store={store}>{children}</Provider>
        );

        const { result } = renderHook(useWeeklyScheduleOps, {
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

        act(() => {
            result.current.copyToNextWeek([meal]);
        });

        expect(store.get(currentWeekAtom)).toStrictEqual(
            new Date('2024-01-08T12:00:00Z'),
        );
        expect(store.get(unsavedChangesAtom)).toStrictEqual({
            'Breakfast_Mon 08/01/2024': {
                day: '2024-01-08 08:00',
                meal: 'Greek yogurt and fruit',
                note: 'Add honey',
                rating: 4,
                section_key: 'Breakfast_Mon 08/01/2024',
                user_id: 7,
            },
        });
    });
});
