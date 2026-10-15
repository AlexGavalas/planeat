'use client';

import type { ReactElement } from 'react';
import { type PropsWithChildren, createContext, useContext } from 'react';

type MealPlanAccess = {
    canEditAnnotations: boolean;
    ownerUserId: number;
};

const MealPlanOwnerContext = createContext<MealPlanAccess | null>(null);

export const MealPlanOwnerProvider = ({
    canEditAnnotations,
    children,
    ownerUserId,
}: PropsWithChildren<Readonly<MealPlanAccess>>): ReactElement => (
    <MealPlanOwnerContext.Provider value={{ canEditAnnotations, ownerUserId }}>
        {children}
    </MealPlanOwnerContext.Provider>
);

export const useMealPlanOwnerId = (
    explicitOwnerUserId?: number,
): number | undefined => {
    const contextOwnerUserId = useContext(MealPlanOwnerContext)?.ownerUserId;
    return explicitOwnerUserId ?? contextOwnerUserId ?? undefined;
};

export const useCanEditMealAnnotations = (): boolean =>
    useContext(MealPlanOwnerContext)?.canEditAnnotations ?? false;
