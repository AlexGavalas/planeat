import { useUser } from '@supabase/supabase-auth-helpers/react';
import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';

import { Button } from '@components/button';

import styles from './header.module.css';

const UserActions = () => {
    const { user } = useUser();

    if (!user) {
        return (
            <Button
                onClick={() => {
                    supabaseClient.auth.signIn({
                        provider: 'google',
                    });
                }}
            >
                Login
            </Button>
        );
    }

    return (
        <Button
            onClick={() => {
                supabaseClient.auth.signOut();
            }}
        >
            Logout
        </Button>
    );
};

export const Header = () => {
    const { isLoading } = useUser();

    return (
        <header className={styles.header}>
            <div className={styles.logoWrapper}>
                <h1 className={styles.logo}>PLANEAT</h1>
                <blockquote># Do the thing!</blockquote>
            </div>
            {!isLoading && <UserActions />}
        </header>
    );
};
