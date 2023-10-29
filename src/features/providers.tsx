import { Center, Loader, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import {
    type DehydratedState,
    HydrationBoundary,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { SessionProvider, type SessionProviderProps } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Fragment, type PropsWithChildren, useMemo } from 'react';

import { BRAND_COLORS } from '~constants/colors';
import { UserContext } from '~store/user-context';
import { type Database } from '~types/supabase';

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
    }>
>;

const PUBLIC_PAGES = ['/'];

export const Providers = ({
    children,
    dehydratedState,
    session,
}: ProvidersProps) => {
    const router = useRouter();

    const supabaseClient = useMemo(
        () => createPagesBrowserClient<Database>(),
        [],
    );

    const queryClient = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnMount: false,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
        [],
    );

    const isProtectedPage = !PUBLIC_PAGES.includes(router.pathname);

    const Wrapper = isProtectedPage ? UserContext : Fragment;

    return (
        <MantineProvider
            theme={{
                colors: {
                    brand: BRAND_COLORS,
                },
                primaryColor: 'brand',
            }}
        >
            <SessionContextProvider supabaseClient={supabaseClient}>
                <SessionProvider session={session}>
                    <QueryClientProvider client={queryClient}>
                        <HydrationBoundary state={dehydratedState}>
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-expect-error - Modals do not get the correct type with dynamic components for some reason */}
                            <ModalsProvider modals={modals}>
                                <Wrapper>{children}</Wrapper>
                                <Notifications />
                            </ModalsProvider>
                        </HydrationBoundary>
                    </QueryClientProvider>
                </SessionProvider>
            </SessionContextProvider>
        </MantineProvider>
    );
};
