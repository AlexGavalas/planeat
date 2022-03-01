import { Button } from '../../components/button';

import styles from './header.module.css';

export const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logoWrapper}>
                <h1 className={styles.logo}>PLANEAT</h1>
                <blockquote># Do the thing!</blockquote>
            </div>
            <div className={styles.button}>
                <Button>Login</Button>
            </div>
        </header>
    );
};
