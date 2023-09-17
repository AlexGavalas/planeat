import { Anchor, Group, Text } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LINKS = [
    { href: '/home', label: 'home' },
    { href: '/meal-plan', label: 'view_weekly_meal' },
    { href: '/connections', label: 'connections.label' },
];

export const Nav = () => {
    const { t } = useTranslation();
    const { pathname } = useRouter();

    return (
        <Group>
            {LINKS.map(({ href, label }) => {
                const isCurrent = pathname === href;

                return (
                    <Link href={href} key={href}>
                        <Anchor component="span">
                            <Text underline={isCurrent}>{t(label)}</Text>
                        </Anchor>
                    </Link>
                );
            })}
        </Group>
    );
};
