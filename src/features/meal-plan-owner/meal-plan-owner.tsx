'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';

const MealPlanOwnerContext = createContext<number | null>(null);

export const MealPlanOwnerProvider = ({
    children,
    ownerUserId,
}: PropsWithChildren<Readonly<{ ownerUserId: number }>>) => (
    <MealPlanOwnerContext.Provider value={ownerUserId}>
        {children}
    </MealPlanOwnerContext.Provider>
);

export const useMealPlanOwnerId = (explicitOwnerUserId?: number) => {
    const contextOwnerUserId = useContext(MealPlanOwnerContext);
    return explicitOwnerUserId ?? contextOwnerUserId ?? undefined;
};
