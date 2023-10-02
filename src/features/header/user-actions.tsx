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

    const handleLoginWithGoogle = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await signIn('google');
    }, []);

    if (!hasUser) {
        return (
            <Button leftSection={<Google />} onClick={handleLoginWithGoogle}>
                {t('login.google')}
            </Button>
        );
    }

    return <UserMenu />;
};
