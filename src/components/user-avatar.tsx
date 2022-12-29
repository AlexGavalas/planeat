import { Avatar } from '@mantine/core';
import Image from 'next/image';

export const UserAvatar = ({ src }: { src: string }) => {
    return (
        <Avatar>
            <Image
                src={src}
                alt="user avatar image"
                width={50}
                height={50}
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                }}
            />
        </Avatar>
    );
};
