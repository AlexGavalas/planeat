import { Avatar, type AvatarProps } from '@mantine/core';

import { getInitials } from '~util/name';

type NameAvatarProps = Readonly<{
    name: string;
    size?: AvatarProps['size'];
}>;

export const NameAvatar = ({ name, size = 'md' }: NameAvatarProps) => (
    <Avatar aria-label={name} color="brand" radius="xl" role="img" size={size}>
        {getInitials(name)}
    </Avatar>
);
