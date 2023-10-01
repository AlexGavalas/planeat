import { useAtom } from 'jotai';
import { omit, set } from 'lodash/fp';
import { useCallback } from 'react';

import { unsavedChangesAtom } from '~store/atoms';
import { type EditedMeal, type Meal } from '~types/meal';

type AddChange = (params: Meal | EditedMeal) => void;

type RemoveChange = (key: string) => void;

type RemoveChanges = () => void;

type UseUnsavedChanges = () => {
    unsavedChanges: Record<string, Meal | EditedMeal>;
    addChange: AddChange;
    removeChange: RemoveChange;
    removeChanges: RemoveChanges;
    hasUnsavedChanges: boolean;
};

export const useUnsavedChanges: UseUnsavedChanges = () => {
    const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);

    const addChange = useCallback<AddChange>(
        (meal) => {
            setUnsavedChanges((prevChanges) =>
                set(meal.section_key, meal, prevChanges),
            );
        },
        [setUnsavedChanges],
    );

    const removeChange = useCallback<RemoveChange>(
        (key) => {
            setUnsavedChanges((prevChanges) => omit(key, prevChanges));
        },
        [setUnsavedChanges],
    );

    const removeChanges = useCallback<RemoveChanges>(() => {
        setUnsavedChanges({});
    }, [setUnsavedChanges]);

    return {
        unsavedChanges,
        addChange,
        removeChange,
        removeChanges,
        hasUnsavedChanges: Object.keys(unsavedChanges).length > 0,
    };
};
