import { Button } from '@mantine/core';
import { Google, LogOut } from 'iconoir-react';
import { signIn, signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export const UserActions = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const hasUser = router.pathname !== '/';

    if (!hasUser) {
        return (
            <Button
                className="button"
                leftIcon={<Google />}
                onClick={async () => {
                    await signIn('google');
                }}
            >
                {t('login.google')}
            </Button>
        );
    }

    return (
        <Button
            className="button"
            onClick={async () => {
                await signOut();
                router.push('/');
            }}
            leftIcon={<LogOut />}
        >
            {t('logout')}
        </Button>
    );
};
