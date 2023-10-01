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
            <Image src={user.image} alt={user.name} width={32} height={32} />
        </Avatar>
    );
};
