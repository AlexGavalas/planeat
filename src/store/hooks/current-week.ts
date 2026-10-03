import { addWeeks, subWeeks } from 'date-fns';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { currentWeekAtom } from '~store/atoms';

type UseCurrentWeek = () => {
    currentWeek: Date;
    goToDate: (date: Date) => void;
    nextWeek: () => void;
    previousWeek: () => void;
};

export const useCurrentWeek: UseCurrentWeek = () => {
    const [currentWeek, setCurrentWeek] = useAtom(currentWeekAtom);

    const goToDate = useCallback(
        (date: Date) => {
            setCurrentWeek(date);
        },
        [setCurrentWeek],
    );

    const nextWeek = useCallback(() => {
        setCurrentWeek((prevWeek) => addWeeks(prevWeek, 1));
    }, [setCurrentWeek]);

    const previousWeek = useCallback(() => {
        setCurrentWeek((prevWeek) => subWeeks(prevWeek, 1));
    }, [setCurrentWeek]);

    return {
        currentWeek,
        goToDate,
        nextWeek,
        previousWeek,
    };
};
