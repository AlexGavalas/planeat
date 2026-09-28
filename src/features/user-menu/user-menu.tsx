import { Menu, UnstyledButton } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type MouseEventHandler, forwardRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { UserAvatar } from '~components/user-avatar';
import { useLocalizedPath } from '~hooks/use-localized-path';

const MenuTrigger = forwardRef<HTMLButtonElement>((props, ref) => {
    return (
        <UnstyledButton ref={ref} {...props}>
            <UserAvatar />
        </UnstyledButton>
    );
});

MenuTrigger.displayName = 'MenuTrigger';

export const UserMenu = () => {
    const localize = useLocalizedPath();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const handleLogout = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        queryClient.clear();
        await signOut({ callbackUrl: '/' });
        router.push('/');
        router.refresh();
    }, [router, queryClient]);

    return (
        <Menu withArrow arrowPosition="center" position="bottom-end">
            <Menu.Target>
                <MenuTrigger />
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item component={Link} href={localize('/settings')}>
                    {t('settings')}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" onClick={handleLogout}>
                    {t('logout')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
