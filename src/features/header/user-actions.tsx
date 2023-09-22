import { Button } from '@mantine/core';
import { Google } from 'iconoir-react';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { UserMenu } from '~features/user-menu';

export const UserActions = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const hasUser = router.pathname !== '/';

    if (!hasUser) {
        return (
            <Button
                leftSection={<Google />}
                onClick={async () => {
                    await signIn('google');
                }}
            >
                {t('login.google')}
            </Button>
        );
    }

    return <UserMenu />;
};
