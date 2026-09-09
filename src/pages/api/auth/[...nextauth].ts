import NextAuth, { type AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import invariant from 'tiny-invariant';

import { createUser } from '~api/user';

invariant(process.env.GOOGLE_ID, 'Missing GOOGLE_ID env var');
invariant(process.env.GOOGLE_SECRET, 'Missing GOOGLE_SECRET env var');

type GoogleProfile = {
    sub: string;
    name: string;
    email: string;
    picture: string;
    locale: string;
};

const isGoogleProfile = (profile: unknown): profile is GoogleProfile => {
    if (typeof profile !== 'object' || profile === null) {
        return false;
    }

    const keys = ['sub', 'name', 'email', 'picture'];

    return keys.every((key) => key in profile);
};

export const authOptions: AuthOptions = {
    events: {
        signIn: async ({ user }) => {
            if (!user.email || !user.name) return;

            await createUser({
                email: user.email,
                fullName: user.name,
                language: user.locale ?? 'en',
            });
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            profile(profile) {
                if (isGoogleProfile(profile)) {
                    return {
                        email: profile.email,
                        id: profile.sub,
                        image: profile.picture,
                        locale: profile.locale,
                        name: profile.name,
                    };
                }

                throw new Error('Could not parse Google profile');
            },
        }),
    ],
};

export default NextAuth(authOptions);
