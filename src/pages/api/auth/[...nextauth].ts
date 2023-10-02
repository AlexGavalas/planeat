import { createClient } from '@supabase/supabase-js';
import NextAuth, { type AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import invariant from 'tiny-invariant';

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

    const keys = ['sub', 'name', 'email', 'picture', 'locale'];

    return keys.every((key) => key in profile);
};

export const authOptions: AuthOptions = {
    events: {
        signIn: async ({ user }) => {
            invariant(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                'Missing NEXT_PUBLIC_SUPABASE_URL env var',
            );

            invariant(
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY env var',
            );

            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                {
                    auth: {
                        persistSession: false,
                    },
                },
            );

            const result = await supabase.from('users').upsert({
                email: user.email,
                full_name: user.name,
                language: user.locale,
            });

            if (result.error) {
                console.error(result.error);
            }
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
