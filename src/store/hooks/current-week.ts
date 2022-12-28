import { addWeeks, subWeeks } from 'date-fns';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { currentWeekAtom } from '~store/atoms';

export const useCurrentWeek = () => {
    const [currentWeek, setCurrentWeek] = useAtom(currentWeekAtom);

    const nextWeek = useCallback(() => {
        setCurrentWeek((prevWeek) => addWeeks(prevWeek, 1));
    }, [setCurrentWeek]);

    const previousWeek = useCallback(() => {
        setCurrentWeek((prevWeek) => subWeeks(prevWeek, 1));
    }, [setCurrentWeek]);

    return {
        currentWeek,
        nextWeek,
        previousWeek,
    };
};
