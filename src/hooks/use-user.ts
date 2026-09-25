import { type Session } from 'next-auth';
import { useSession } from 'next-auth/react';

type UseUser = {
    isLoading: boolean;
    user: Session['user'];
};

export const useUser = (): UseUser => {
    const { data, status } = useSession();

    return {
        isLoading: status === 'loading',
        user: data?.user,
    };
};
