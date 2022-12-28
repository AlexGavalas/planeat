import { Avatar } from '@mantine/core';
import Image from 'next/image';

export const UserAvatar = ({ src }: { src: string }) => {
    return (
        <Avatar>
            <Image
                src={src}
                alt="user avatar image"
                layout="intrinsic"
                width={50}
                height={50}
            />
        </Avatar>
    );
};
