import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { SessionProvider, type SessionProviderProps } from 'next-auth/react';
import { type PropsWithChildren, useMemo } from 'react';
import {
    type DehydratedState,
    Hydrate,
    QueryClient,
    QueryClientProvider,
} from 'react-query';

import { BRAND_COLORS } from '~constants/colors';
import { UserContext } from '~store/user-context';
import { type Database } from '~types/supabase';

export const Providers = ({
    children,
    dehydratedState,
    session,
}: PropsWithChildren<{
    session: SessionProviderProps['session'];
    dehydratedState: DehydratedState;
}>) => {
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
                        <Hydrate state={dehydratedState}>
                            <ModalsProvider>
                                <UserContext>{children}</UserContext>
                                <Notifications />
                            </ModalsProvider>
                        </Hydrate>
                    </QueryClientProvider>
                </SessionProvider>
            </SessionContextProvider>
        </MantineProvider>
    );
};
