import { Avatar, type AvatarProps } from '@mantine/core';

const getInitials = (name: string): string | null => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts.at(0)?.match(/[\p{L}\p{N}]/u)?.[0];
    const last = parts.at(-1)?.match(/[\p{L}\p{N}]/u)?.[0];

    if (!first) {
        return null;
    }

    return (parts.length === 1 ? first : `${first}${last ?? ''}`).toUpperCase();
};

type NameAvatarProps = Readonly<{
    name: string;
    size?: AvatarProps['size'];
}>;

export const NameAvatar = ({ name, size = 'md' }: NameAvatarProps) => (
    <Avatar aria-label={name} color="brand" radius="xl" role="img" size={size}>
        {getInitials(name)}
    </Avatar>
);
