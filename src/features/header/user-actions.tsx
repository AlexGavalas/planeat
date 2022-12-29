import { Button } from '@mantine/core';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Google, LogOut } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { type Database } from '~types/supabase';

export const UserActions = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const supabaseClient = useSupabaseClient<Database>();

    const hasUser = router.pathname !== '/';

    if (!hasUser) {
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
                router.push('/');
            }}
            leftIcon={<LogOut />}
        >
            {t('logout')}
        </Button>
    );
};
