import { Box, Group, Title } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { APP_NAME } from '~constants/brand';
import { Nav } from '~features/nav';
import { useLocalizedPath } from '~hooks/use-localized-path';
import { useProfile } from '~hooks/use-profile';

import styles from './header.module.css';
import { UserActions } from './user-actions';

export const Header = (): ReactElement => {
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
                <Title className={styles.logo} order={1} size="1.6rem">
                    <Image
                        alt=""
                        aria-hidden
                        className={styles.mark}
                        height={32}
                        loading="eager"
                        src="/brand/habitthread-symbol.png"
                        width={32}
                    />
                    {APP_NAME}
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
