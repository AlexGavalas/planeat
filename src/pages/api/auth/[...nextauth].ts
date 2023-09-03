import { createClient } from '@supabase/supabase-js';
import NextAuth, { type AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import invariant from 'tiny-invariant';

invariant(process.env.GOOGLE_ID, 'Missing GOOGLE_ID env var');
invariant(process.env.GOOGLE_SECRET, 'Missing GOOGLE_SECRET env var');

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    locale: profile.locale,
                };
            },
        }),
    ],
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
};

export default NextAuth(authOptions);
