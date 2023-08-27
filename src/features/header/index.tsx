import { Group, Title } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Nav } from '~features/nav';

import { UserActions } from './user-actions';

export const Header = () => {
    const router = useRouter();

    const hasUser = router.pathname !== '/';

    return (
        <Group position="apart" align="center" py={10} px={20}>
            <Link href="/">
                <Title order={1} style={{ cursor: 'pointer' }}>
                    PLANEAT
                </Title>
            </Link>
            <Group position="apart" align="center" py={10} px={20}>
                {hasUser && <Nav />}
                <UserActions />
            </Group>
        </Group>
    );
};
