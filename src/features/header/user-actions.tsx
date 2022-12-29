import { Button } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Google, LogOut } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { useProfile } from '~hooks/use-profile';
import { type Database } from '~types/supabase';

export const UserActions = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const supabaseClient = useSupabaseClient<Database>();
    const { isFetching, user, logout } = useProfile();

    if (isFetching) return null;

    if (!user) {
        return (
            <Button
                leftIcon={<Google />}
                onClick={() => {
                    supabaseClient.auth.signInWithOAuth({
                        provider: 'google',
                    });
                }}
            >
                {t('login.google')}
            </Button>
        );
    }

    return (
        <Button
            onClick={async () => {
                await supabaseClient.auth.signOut();
                await logout();
                router.push('/');
            }}
            leftIcon={<LogOut />}
        >
            {t('logout')}
        </Button>
    );
};
