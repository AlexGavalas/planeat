import { Group, Title } from '@mantine/core';
import Link from 'next/link';

import { Nav } from '~features/nav';
import { useProfile } from '~hooks/use-profile';

import { UserActions } from './user-actions';

export const Header = () => {
    const { profile, isFetching } = useProfile();

    const hasUser = !isFetching && !!profile;

    return (
        <Group align="center" justify="space-between" px={20} py={10}>
            <Link href="/">
                <Title order={1} style={{ cursor: 'pointer' }}>
                    PLANEAT
                </Title>
            </Link>
            {!isFetching && (
                <Group align="center" justify="space-between" px={20} py={10}>
                    {hasUser && <Nav />}
                    <UserActions hasUser={hasUser} />
                </Group>
            )}
        </Group>
    );
};
