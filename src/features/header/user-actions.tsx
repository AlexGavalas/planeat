import { Button } from '@mantine/core';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@supabase/auth-helpers-react';
import { Google, LogOut } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

export const UserActions = () => {
    const { t } = useTranslation();

    const { user } = useUser();

    if (!user) {
        return (
            <Button
                leftIcon={<Google />}
                onClick={() => {
                    supabaseClient.auth.signIn({
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
            onClick={() => {
                supabaseClient.auth.signOut();
            }}
            leftIcon={<LogOut />}
        >
            {t('logout')}
        </Button>
    );
};
