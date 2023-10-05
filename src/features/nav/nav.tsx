import { Anchor, Group, Text } from '@mantine/core';
import { type KeyPrefix } from 'i18next';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

type LinkItem = {
    href: string;
    label: KeyPrefix<'common'>;
};

const LINKS = [
    { href: '/home', label: 'home' },
    { href: '/meal-plan', label: 'view_weekly_meal' },
    { href: '/connections', label: 'connections.title' },
] as const satisfies readonly LinkItem[];

export const Nav = () => {
    const { t } = useTranslation();
    const { pathname } = useRouter();

    return (
        <Group>
            {LINKS.map(({ href, label }) => {
                const isCurrent = pathname === href;

                return (
                    <Link key={href} href={href}>
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
