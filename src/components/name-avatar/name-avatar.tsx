import { Avatar, type AvatarProps } from '@mantine/core';
import type { ReactElement } from 'react';

import { getInitials } from '~util/name';

type NameAvatarProps = Readonly<{
    name: string;
    size?: AvatarProps['size'];
}>;

export const NameAvatar = ({
    name,
    size = 'md',
}: NameAvatarProps): ReactElement => (
    <Avatar aria-label={name} color="brand" radius="xl" role="img" size={size}>
        {getInitials(name)}
    </Avatar>
);
