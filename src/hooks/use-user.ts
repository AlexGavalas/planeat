import { type Session } from 'next-auth';
import { useSession } from 'next-auth/react';

export const useUser = (): Session['user'] => {
    const { data } = useSession();

    return data?.user;
};
