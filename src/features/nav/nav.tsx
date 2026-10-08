import { Anchor, Group, Text } from '@mantine/core';
import { type KeyPrefix } from 'i18next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useLocalizedPath } from '~hooks/use-localized-path';

type LinkItem = {
    href: string;
    label: KeyPrefix<'common'>;
};

export const NAV_LINKS = [
    { href: '/home', label: 'home' },
    { href: '/meal-plan', label: 'view_weekly_meal' },
    { href: '/connections', label: 'connections.title' },
] as const satisfies readonly LinkItem[];

export const PROFESSIONAL_LINK = {
    href: '/professional',
    label: 'professional.navigation',
} as const satisfies LinkItem;

export const Nav = ({
    isProfessional = false,
}: Readonly<{ isProfessional?: boolean }>) => {
    const localize = useLocalizedPath();
    const { t } = useTranslation();
    const pathname = usePathname();
    const links = isProfessional
        ? [PROFESSIONAL_LINK, ...NAV_LINKS]
        : NAV_LINKS;

    return (
        <Group>
            {links.map(({ href, label }) => {
                const isCurrent = pathname === localize(href);

                return (
                    <Link key={href} href={localize(href)}>
                        <Anchor component="span">
                            <Text td={isCurrent ? 'underline' : undefined}>
                                {t(label)}
                            </Text>
                        </Anchor>
                    </Link>
                );
            })}
        </Group>
    );
};
