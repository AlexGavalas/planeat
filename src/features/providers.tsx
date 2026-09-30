/* eslint-disable react/jsx-max-depth -- Providers are fine to have more nesting */
'use client';

import { Center, Loader, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import {
    type DehydratedState,
    HydrationBoundary,
    QueryClientProvider,
} from '@tanstack/react-query';
import { parseISO } from 'date-fns';
import { type Resource } from 'i18next';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { SessionProvider, type SessionProviderProps } from 'next-auth/react';
import { I18nProvider } from 'next-i18next/client';
import dynamic from 'next/dynamic';
import { type PropsWithChildren, useState } from 'react';

import { Header } from '~features/header';
import { Onboarding } from '~features/onboarding';
import { currentWeekAtom } from '~store/atoms';
import { UserContext } from '~store/user-context';
import { APP_THEME, appCssVariablesResolver } from '~theme';
import { createQueryClient } from '~util/query-client';

const CenterLoader = () => (
    <Center py="md">
        <Loader />
    </Center>
);

const modals = {
    activity: dynamic(
        () => import('./modals/activity').then((m) => m.ActivityModal),
        {
            loading: CenterLoader,
        },
    ),
    'delete-account': dynamic(() =>
        import('./modals/delete-account').then((m) => m.DeleteAccountModal),
    ),
    meal: dynamic(() => import('./modals/meal').then((m) => m.MealModal)),
    'meal-note': dynamic(() =>
        import('./modals/meal-note').then((m) => m.MealNoteModal),
    ),
    'meal-pool': dynamic(() =>
        import('./modals/meal-pool').then((m) => m.MealPoolModal),
    ),
    'meal-rating': dynamic(() =>
        import('./modals/meal-rating').then((m) => m.MealRatingModal),
    ),
    measurement: dynamic(() =>
        import('./modals/measurement').then((m) => m.MeasurementModal),
    ),
    'week-overview': dynamic(() =>
        import('./modals/week-overview').then((m) => m.WeekOverviewModal),
    ),
} as const;

declare module '@mantine/modals' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface MantineModalsOverride {
        modals: typeof modals;
    }
}

type ProvidersProps = PropsWithChildren<
    Readonly<{
        session: SessionProviderProps['session'];
        dehydratedState: DehydratedState;
        language: string;
        resources: Resource;
        initialWeek: string;
    }>
>;

export const Providers = ({
    children,
    dehydratedState,
    session,
    language,
    resources,
    initialWeek,
}: ProvidersProps) => {
    // These instances intentionally persist for the lifetime of this account.
    // eslint-disable-next-line react/hook-use-state
    const [queryClient] = useState(createQueryClient);
    // eslint-disable-next-line react/hook-use-state
    const [store] = useState(() => {
        const value = createStore();
        value.set(currentWeekAtom, parseISO(initialWeek));
        return value;
    });
    const content = (
        <UserContext>
            <Header />
            {session && <Onboarding />}
            <div className="container">{children}</div>
        </UserContext>
    );
    const modalsContent = (
        // @ts-expect-error - dynamic modal components lose their specific props
        <ModalsProvider modals={modals}>
            {content}
            <Notifications />
        </ModalsProvider>
    );
    return (
        <I18nProvider
            fallbackLng="en"
            language={language}
            resources={resources}
            supportedLngs={['en', 'gr']}
        >
            <MantineProvider
                cssVariablesResolver={appCssVariablesResolver}
                theme={APP_THEME}
            >
                <SessionProvider session={session}>
                    <QueryClientProvider client={queryClient}>
                        <HydrationBoundary state={dehydratedState}>
                            <JotaiProvider store={store}>
                                {modalsContent}
                            </JotaiProvider>
                        </HydrationBoundary>
                    </QueryClientProvider>
                </SessionProvider>
            </MantineProvider>
        </I18nProvider>
    );
};
