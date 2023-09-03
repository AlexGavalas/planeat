import { Menu, UnstyledButton } from '@mantine/core';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { forwardRef } from 'react';

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

    return (
        <Menu withArrow position="bottom-end" arrowPosition="center">
            <Menu.Target>
                <MenuTrigger />
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    onClick={async () => {
                        await signOut();
                        router.push('/');
                    }}
                >
                    {t('logout')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
