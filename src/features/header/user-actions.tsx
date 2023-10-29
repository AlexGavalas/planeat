import { Button } from '@mantine/core';
import { Google } from 'iconoir-react';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { type MouseEventHandler, useCallback } from 'react';

import { UserMenu } from '~features/user-menu';

type UserActionsProps = Readonly<{
    hasUser: boolean;
}>;

export const UserActions = ({ hasUser }: UserActionsProps) => {
    const { t } = useTranslation();

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
