import { Anchor, Group } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const LINKS = [
    { href: '/home', label: 'home' },
    { href: '/meal-plan', label: 'view_weekly_meal' },
    { href: '/settings', label: 'user_settings' },
];

export const Nav = () => {
    const { t } = useTranslation();

    return (
        <Group>
            {LINKS.map(({ href, label }) => (
                <Link href={href} key={href}>
                    <Anchor component="span">{t(label)}</Anchor>
                </Link>
            ))}
        </Group>
    );
};
