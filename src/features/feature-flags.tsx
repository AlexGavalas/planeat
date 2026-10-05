'use client';

import { type PropsWithChildren, createContext, useContext } from 'react';

export type FeatureFlags = {
    isFoodDatabaseSearchEnabled: boolean;
};

const FeatureFlagsContext = createContext<FeatureFlags>({
    isFoodDatabaseSearchEnabled: false,
});

export const FeatureFlagsProvider = ({
    children,
    value,
}: PropsWithChildren<Readonly<{ value: FeatureFlags }>>) => (
    <FeatureFlagsContext.Provider value={value}>
        {children}
    </FeatureFlagsContext.Provider>
);

export const useFeatureFlags = (): FeatureFlags =>
    useContext(FeatureFlagsContext);
