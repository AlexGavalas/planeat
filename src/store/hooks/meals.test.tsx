import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, createStore } from 'jotai';
import { type PropsWithChildren } from 'react';

import { currentWeekAtom, unsavedChangesAtom } from '~store/atoms';
import { act, renderHook, waitFor } from '~test/utils';
import { type Meal } from '~types/meal';

import { saveMealPlan } from '../../app/actions';
import { useMeals } from './meals';

describe('useMeals', () => {
    it('loads the current week and saves a meal edit', async () => {
        expect.hasAssertions();

        const meal: Meal = {
            day: '2024-01-01 08:00',
            id: '10accc9d-f0b7-4225-87df-3e91d5639d75',
            meal: 'Porridge',
            note: null,
            rating: null,
            section_key: 'Breakfast_Mon 01/01/2024',
            user_id: 7,
        };
        const fetchMock = jest
            .spyOn(global, 'fetch')
            .mockResolvedValueOnce(Response.json({ data: [meal] }))
            .mockResolvedValueOnce(Response.json({ data: [meal] }));
        jest.mocked(saveMealPlan).mockResolvedValue({ ok: true });

        const store = createStore();
        store.set(currentWeekAtom, new Date('2024-01-03T12:00:00Z'));
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        const Wrapper = ({ children }: PropsWithChildren): React.ReactNode => (
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </Provider>
        );

        const { result } = renderHook(useMeals, { wrapper: Wrapper });

        await waitFor(() => {
            expect({
                calls: fetchMock.mock.calls,
                meals: result.current.meals,
            }).toStrictEqual({
                calls: [
                    ['/api/v1/meal?startDate=2024-01-01&endDate=2024-01-07'],
                ],
                meals: [meal],
            });
        });

        act(() => {
            result.current.saveEntryCell({
                meal,
                note: 'Use oat milk',
                rating: 5,
                sectionKey: meal.section_key,
                timestamp: new Date('2024-01-01T08:00:00Z'),
                userId: 7,
                value: 'Banana porridge',
            });
        });

        expect(store.get(unsavedChangesAtom)[meal.section_key]).toMatchObject({
            id: meal.id,
            meal: 'Banana porridge',
            note: 'Use oat milk',
            rating: 5,
            user_id: 7,
        });

        await act(async () => {
            await result.current.savePlan();
        });

        expect({
            calls: jest.mocked(saveMealPlan).mock.calls,
            unsavedChanges: store.get(unsavedChangesAtom),
        }).toStrictEqual({
            calls: [
                [
                    {
                        deletedIds: [],
                        editedMeals: [
                            expect.objectContaining({
                                id: meal.id,
                                meal: 'Banana porridge',
                            }),
                        ],
                        newMeals: [],
                    },
                ],
            ],
            unsavedChanges: {},
        });

        fetchMock.mockRestore();
        queryClient.clear();
    });
});
