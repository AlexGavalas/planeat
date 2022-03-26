import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { i18n } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useQuery } from 'react-query';

export const UserContext: FC = ({ children }) => {
    const { user } = useUser();
    const router = useRouter();

    const { data: profile } = useQuery(
        ['user'],
        async () => {
            if (!user) return;

            const { data } = await supabaseClient
                .from<Profile>('users')
                .select('*')
                .eq('id', user.id)
                .single();

            return data;
        },
        {
            enabled: Boolean(user),
        }
    );

    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(
            (event) => {
                if (event === 'SIGNED_IN') {
                    router.push('/home');
                } else if (event === 'SIGNED_OUT') {
                    router.push('/');
                }
            }
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (profile) {
            i18n?.changeLanguage(profile.language);
        }
    }, [profile]);

    return <>{children}</>;
};
