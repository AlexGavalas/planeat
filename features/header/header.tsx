import styles from './header.module.css';

export const Header = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.logo}>PLANEAT</h1>
            <blockquote># Do the thing!</blockquote>
        </header>
    );
};
