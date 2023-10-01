import { Menu, UnstyledButton } from '@mantine/core';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type MouseEventHandler, forwardRef, useCallback } from 'react';

import { UserAvatar } from '~components/user-avatar';

const MenuTrigger = forwardRef<HTMLButtonElement>((props, ref) => {
    return (
        <UnstyledButton ref={ref} {...props}>
            <UserAvatar />
        </UnstyledButton>
    );
});

MenuTrigger.displayName = 'MenuTrigger';

export const UserMenu = () => {
    const router = useRouter();
    const { t } = useTranslation();

    const handleLogout: MouseEventHandler<HTMLButtonElement> =
        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- async event handler
        useCallback(async () => {
            await signOut();
            await router.push('/');
        }, [router]);

    return (
        <Menu withArrow position="bottom-end" arrowPosition="center">
            <Menu.Target>
                <MenuTrigger />
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item component={Link} href="/settings">
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
