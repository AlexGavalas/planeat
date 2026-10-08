import { addWeeks, subWeeks } from 'date-fns';
import { useAtom } from 'jotai';

import { currentWeekAtom } from '~store/atoms';

type UseCurrentWeek = () => {
    currentWeek: Date;
    goToDate: (date: Date) => void;
    nextWeek: () => void;
    previousWeek: () => void;
};

export const useCurrentWeek: UseCurrentWeek = () => {
    const [currentWeek, setCurrentWeek] = useAtom(currentWeekAtom);

    const goToDate = (date: Date): void => {
        setCurrentWeek(date);
    };

    const nextWeek = (): void => {
        setCurrentWeek((prevWeek) => addWeeks(prevWeek, 1));
    };

    const previousWeek = (): void => {
        setCurrentWeek((prevWeek) => subWeeks(prevWeek, 1));
    };

    return {
        currentWeek,
        goToDate,
        nextWeek,
        previousWeek,
    };
};
