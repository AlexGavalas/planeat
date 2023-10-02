import { Group, Title } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Nav } from '~features/nav';

import { UserActions } from './user-actions';

export const Header = () => {
    const router = useRouter();

    const hasUser = router.pathname !== '/';

    return (
        <Group align="center" justify="space-between" px={20} py={10}>
            <Link href="/">
                <Title order={1} style={{ cursor: 'pointer' }}>
                    PLANEAT
                </Title>
            </Link>
            <Group align="center" justify="space-between" px={20} py={10}>
                {hasUser && <Nav />}
                <UserActions />
            </Group>
        </Group>
    );
};
