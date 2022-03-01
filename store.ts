import { addWeeks, subWeeks } from 'date-fns';
import create from 'zustand';

interface StoreI {
    currentWeek: Date;
    nextWeek: () => void;
    previousWeek: () => void;
}

export const useStore = create<StoreI>((set) => ({
    currentWeek: new Date(),
    nextWeek: () =>
        set((state) => ({
            currentWeek: addWeeks(state.currentWeek, 1),
        })),
    previousWeek: () =>
        set((state) => ({ currentWeek: subWeeks(state.currentWeek, 1) })),
}));
