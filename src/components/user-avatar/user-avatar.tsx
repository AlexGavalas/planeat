import { Avatar } from '@mantine/core';
import Image from 'next/image';

import { useProfile } from '~hooks/use-profile';

const getInitials = (name: string | null | undefined): string | null => {
    const nameParts = name?.trim().split(/\s+/).filter(Boolean) ?? [];

    if (!nameParts.length) {
        return null;
    }

    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];

    if (!firstName || !lastName) {
        return null;
    }

    const initialPattern = /[\p{L}\p{N}]/u;
    const firstInitial = initialPattern.exec(firstName)?.[0];
    const lastInitial = initialPattern.exec(lastName)?.[0];

    if (!firstInitial) {
        return null;
    }

    return (
        nameParts.length === 1
            ? firstInitial
            : `${firstInitial}${lastInitial ?? ''}`
    ).toUpperCase();
};

export const UserAvatar = () => {
    const { user } = useProfile();

    if (!user) {
        return null;
    }

    const initials = getInitials(user.name);

    return (
        <Avatar
            aria-label={
                user.image ? undefined : user.name?.trim() || 'User avatar'
            }
            radius="xl"
            role={user.image ? undefined : 'img'}
            size="sm"
        >
            {user.image ? (
                <Image
                    alt={user.name ?? 'User avatar'}
                    height={32}
                    src={user.image}
                    width={32}
                />
            ) : (
                initials
            )}
        </Avatar>
    );
};
