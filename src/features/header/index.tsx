import { Divider, Group, Title } from '@mantine/core';
import Link from 'next/link';

import { UserActions } from './user-actions';

export const Header = () => {
    return (
        <>
            <Group position="apart" align="center" py={10} px={20}>
                <Link href="/" passHref>
                    <Title order={1} style={{ cursor: 'pointer' }}>
                        PLANEAT
                    </Title>
                </Link>
                <UserActions />
            </Group>
            <Divider />
        </>
    );
};
