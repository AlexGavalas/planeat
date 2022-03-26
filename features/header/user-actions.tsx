import { useUser } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { Google, LogOut } from 'iconoir-react';
import { Button } from '@mantine/core';

export const UserActions = () => {
    const { user } = useUser();

    if (!user) {
        return (
            <Button
                leftIcon={<Google />}
                onClick={() => {
                    supabaseClient.auth.signIn({
                        provider: 'google',
                    });
                }}
            >
                Login with Google
            </Button>
        );
    }

    return (
        <Button
            onClick={() => {
                supabaseClient.auth.signOut();
            }}
            leftIcon={<LogOut />}
        >
            Logout
        </Button>
    );
};
