import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { i18n } from 'next-i18next';
import { useRouter } from 'next/router';
import { type FC, type ReactNode, useEffect } from 'react';

import { useProfile } from '~hooks/use-profile';

export const UserContext: FC<{ children?: ReactNode }> = ({ children }) => {
    const router = useRouter();

    const { profile } = useProfile();

    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(
            (event) => {
                if (event === 'SIGNED_IN') {
                    router.push('/home');
                } else if (event === 'SIGNED_OUT') {
                    router.push('/');
                }
            },
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, [router]);

    useEffect(() => {
        if (profile) {
            i18n?.changeLanguage(profile.language);
        }
    }, [profile]);

    return <>{children}</>;
};
