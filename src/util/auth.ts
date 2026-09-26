import { type Session } from 'next-auth';

export const makeSessionSerializable = (session: Session): Session => {
    if (!session.user || session.user.image !== undefined) {
        return session;
    }

    return {
        ...session,
        user: {
            ...session.user,
            image: null,
        },
    };
};
