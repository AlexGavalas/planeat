import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { Google, LogOut } from 'iconoir-react';
import { Button, Title } from '@mantine/core';

import styles from './header.module.css';

const UserActions = () => {
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(
            (event) => {
                if (event === 'SIGNED_IN') {
                    router.push('/home');
                } else if (event === 'SIGNED_OUT') {
                    router.push('/');
                }
            }
        );

        return () => {
            authListener?.unsubscribe();
        };
    }, []);

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

export const Header = () => {
    const { isLoading } = useUser();

    return (
        <header className={styles.header}>
            <Title>PLANEAT</Title>
            {!isLoading && <UserActions />}
        </header>
    );
};
