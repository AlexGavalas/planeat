import { useAtom } from 'jotai';
import { omit, set } from 'lodash/fp';
import { useCallback } from 'react';

import { useMealPlanOwnerId } from '~features/meal-plan-owner';
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

export const useUnsavedChanges = (
    explicitOwnerUserId?: number,
): ReturnType<UseUnsavedChanges> => {
    const ownerUserId = useMealPlanOwnerId(explicitOwnerUserId);
    const ownerKey = String(ownerUserId ?? 'anonymous');
    const [changesByOwner, setUnsavedChanges] = useAtom(unsavedChangesAtom);
    const unsavedChanges = changesByOwner[ownerKey] ?? {};

    const addChange = useCallback<AddChange>(
        (meal) => {
            setUnsavedChanges((prevChanges) => ({
                ...prevChanges,
                [ownerKey]: set(
                    meal.section_key,
                    meal,
                    prevChanges[ownerKey] ?? {},
                ),
            }));
        },
        [ownerKey, setUnsavedChanges],
    );

    const removeChange = useCallback<RemoveChange>(
        (key) => {
            setUnsavedChanges((prevChanges) => ({
                ...prevChanges,
                [ownerKey]: omit(key, prevChanges[ownerKey] ?? {}),
            }));
        },
        [ownerKey, setUnsavedChanges],
    );

    const removeChanges = useCallback<RemoveChanges>(() => {
        setUnsavedChanges((prevChanges) => omit(ownerKey, prevChanges));
    }, [ownerKey, setUnsavedChanges]);

    return {
        addChange,
        hasUnsavedChanges: Object.keys(unsavedChanges).length > 0,
        removeChange,
        removeChanges,
        unsavedChanges,
    };
};
