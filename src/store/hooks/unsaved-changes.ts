import { useAtom } from 'jotai';
import { omit, set } from 'lodash/fp';
import { useCallback } from 'react';

import { unsavedChangesAtom } from '@store/atoms';

export const useUnsavedChanges = () => {
    const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);

    const addChange = useCallback((meal: Meal | EditedMeal) => {
        setUnsavedChanges((prevChanges) =>
            set(meal.section_key, meal, prevChanges)
        );
    }, []);

    const removeChange = useCallback((key: string) => {
        setUnsavedChanges((prevChanges) => omit(key, prevChanges));
    }, []);

    const removeChanges = useCallback(() => {
        setUnsavedChanges({});
    }, []);

    return {
        unsavedChanges,
        addChange,
        removeChange,
        removeChanges,
    };
};
