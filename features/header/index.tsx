import Link from 'next/link';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { Divider, Group, Title } from '@mantine/core';

import { UserActions } from './user-actions';

export const Header = () => {
    const { isLoading } = useUser();

    return (
        <>
            <Group position="apart" align="center" py={10} px={20}>
                <Link href="/" passHref>
                    <Title order={1} style={{ cursor: 'pointer' }}>
                        PLANEAT
                    </Title>
                </Link>
                {!isLoading && <UserActions />}
            </Group>
            <Divider />
        </>
    );
};
