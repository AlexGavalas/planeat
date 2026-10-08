import { Avatar } from '@mantine/core';
import Image from 'next/image';

import { useProfile } from '~hooks/use-profile';
import { getInitials } from '~util/name';

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
