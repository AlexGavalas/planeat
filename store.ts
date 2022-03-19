import { add, addWeeks, format, parse, subWeeks } from 'date-fns';
import create from 'zustand';

import { getDaysOfWeek } from '@util/date';
import { ROWS } from './features/calendar/constants';

const getInitialState = (currentWeek: Date) => {
    return Object.fromEntries(
        ROWS.map((row) =>
            getDaysOfWeek(currentWeek).map(({ label }) => [
                `${row}_${label}`,
                { content: '' },
            ])
        ).flat(1)
    );
};

const cloneState = ({ content }: { content: Record<string, Content> }) => {
    return Object.keys(content).reduce((acc: Record<string, Content>, key) => {
        const newKey = key.replace(/(\d+\/\d+\/\d+)$/, (match) => {
            const prevDate = parse(match, 'dd/MM/yyyy', new Date());

            return format(add(prevDate, { weeks: 1 }), 'dd/MM/yyyy');
        });

        acc[newKey] = { ...content[key] };

        return acc;
    }, {});
};

const NOW = new Date();

export const useStore = create<StoreI>((set) => ({
    currentWeek: NOW,
    content: {
        [NOW.toISOString()]: getInitialState(NOW),
    },
    unsavedChanges: {},
    addChange: (meal) =>
        set((state) => ({
            unsavedChanges: {
                ...state.unsavedChanges,
                [meal.section_key]: meal,
            },
        })),
    removeChanges: () =>
        set(() => ({
            unsavedChanges: {},
        })),
    copyToNextWeek: () =>
        set((state) => {
            const nextWeek = addWeeks(state.currentWeek, 1);

            const currentContent =
                state.content[state.currentWeek.toISOString()];

            return {
                currentWeek: nextWeek,
                content: {
                    ...state.content,
                    [nextWeek.toISOString()]: cloneState({
                        content: currentContent,
                    }),
                },
            };
        }),
    editCell: (key, value) =>
        set((state) => {
            const prevContent = state.content[state.currentWeek.toISOString()];

            prevContent[key].content = value;

            return {
                content: {
                    ...state.content,
                    [state.currentWeek.toISOString()]: { ...prevContent },
                },
            };
        }),
    swapDays: ({
        destinationId,
        originId,
    }: {
        destinationId: string;
        originId: string;
    }) =>
        set((state) => {
            const key = state.currentWeek.toISOString();

            const prevContent = state.content[key];

            [prevContent[destinationId], prevContent[originId]] = [
                prevContent[originId],
                prevContent[destinationId],
            ];

            return {
                content: {
                    ...state.content,
                    [key]: { ...prevContent },
                },
            };
        }),
    nextWeek: () =>
        set((state) => {
            const nextWeek = addWeeks(state.currentWeek, 1);
            const key = nextWeek.toISOString();

            return {
                currentWeek: nextWeek,
                content: {
                    ...state.content,
                    [key]: state.content[key] ?? getInitialState(nextWeek),
                },
            };
        }),
    previousWeek: () =>
        set((state) => {
            const prevWeek = subWeeks(state.currentWeek, 1);
            const key = prevWeek.toISOString();

            return {
                currentWeek: prevWeek,
                content: {
                    ...state.content,
                    [key]: state.content[key] ?? getInitialState(prevWeek),
                },
            };
        }),
}));
