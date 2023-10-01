import { Button } from '@mantine/core';
import { Google } from 'iconoir-react';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { type MouseEventHandler, useCallback } from 'react';

import { UserMenu } from '~features/user-menu';

export const UserActions = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const hasUser = router.pathname !== '/';

    const loginWithGoogle: MouseEventHandler<HTMLButtonElement> =
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
        useCallback(async () => {
            await signIn('google');
        }, []);

    if (!hasUser) {
        return (
            <Button leftSection={<Google />} onClick={loginWithGoogle}>
                {t('login.google')}
            </Button>
        );
    }

    return <UserMenu />;
};
