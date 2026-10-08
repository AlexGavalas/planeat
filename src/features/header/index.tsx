import { Box, Group, Title } from '@mantine/core';
import Link from 'next/link';

import { Nav } from '~features/nav';
import { useLocalizedPath } from '~hooks/use-localized-path';
import { useProfile } from '~hooks/use-profile';

import styles from './header.module.css';
import { UserActions } from './user-actions';

export const Header = () => {
    const localize = useLocalizedPath();
    const { profile, isFetching } = useProfile();

    const hasUser = !isFetching && !!profile;
    const isProfessional = profile?.roles.includes('professional') ?? false;

    return (
        <Group
            className={styles.header}
            component="header"
            justify="space-between"
            wrap="nowrap"
        >
            <Link className={styles.brand} href={localize('/')}>
                <Title className={styles.logo} order={1}>
                    PLANEAT
                </Title>
            </Link>
            {!isFetching && (
                <Group className={styles.actions} gap="md" wrap="nowrap">
                    {hasUser && (
                        <Box visibleFrom="sm">
                            <Nav isProfessional={isProfessional} />
                        </Box>
                    )}
                    <UserActions
                        hasUser={hasUser}
                        isProfessional={isProfessional}
                    />
                </Group>
            )}
        </Group>
    );
};
