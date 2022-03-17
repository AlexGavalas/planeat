import {
    addWeeks,
    eachDayOfInterval,
    endOfWeek,
    format,
    startOfWeek,
    subWeeks,
} from 'date-fns';

import create from 'zustand';

import { ROWS } from './features/calendar/constants';

interface StoreI {
    currentWeek: Date;
    content: Record<string, Record<string, Content>>;
    editCell: (key: string, value: string) => void;
    swapDays: (props: { destinationId: string; originId: string }) => void;
    nextWeek: () => void;
    previousWeek: () => void;
}

const getDaysOfWeek = (date: Date) => {
    return eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
    }).map((day) => ({ timestamp: day, label: format(day, 'EEE dd/M') }));
};

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

const NOW = new Date();

export const useStore = create<StoreI>((set) => ({
    currentWeek: NOW,
    content: {
        [NOW.toISOString()]: getInitialState(NOW),
    },
    editCell: (key, value) =>
        set((state) => {
            const prevContent = state.content[state.currentWeek.toISOString()];
            prevContent[key].content = value;
            return state;
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
