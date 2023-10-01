import { Avatar } from '@mantine/core';
import Image from 'next/image';

import { useProfile } from '~hooks/use-profile';

export const UserAvatar = () => {
    const { user } = useProfile();

    if (!user?.image || !user.name) {
        return null;
    }

    return (
        <Avatar radius="xl" size="sm">
            <Image alt={user.name} height={32} src={user.image} width={32} />
        </Avatar>
    );
};
