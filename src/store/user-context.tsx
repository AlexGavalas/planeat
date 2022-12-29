import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { i18n } from 'next-i18next';
import { useRouter } from 'next/router';
import { type FC, type ReactNode, useEffect } from 'react';

import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

export const UserContext: FC<{ children?: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const { profile } = useProfile();

    const supabaseClient = useSupabaseClient<Database>();

    useEffect(() => {
        if (profile) {
            i18n?.changeLanguage(profile.language);
        }
    }, [profile]);

    useEffect(() => {
        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                router.push('/home');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, supabaseClient.auth]);

    return <>{children}</>;
};
