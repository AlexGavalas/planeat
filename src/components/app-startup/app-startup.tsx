import { type CSSProperties } from 'react';

import { APP_TOKENS, BRAND_COLORS } from '~theme/theme';

import styles from './app-startup.module.css';

const startupStyle = {
    '--startup-background': APP_TOKENS.color.surfacePage,
    '--startup-color': BRAND_COLORS[8],
    '--startup-spinner-active': BRAND_COLORS[6],
    '--startup-spinner-track': BRAND_COLORS[1],
    background: APP_TOKENS.color.surfacePage,
    color: BRAND_COLORS[8],
    display: 'grid',
    fontFamily: "'Noto Sans Variable', sans-serif",
    inset: 0,
    minHeight: '100dvh',
    padding: '2rem',
    placeItems: 'center',
    position: 'fixed',
    zIndex: 1000,
} as CSSProperties;

export function AppStartup() {
    return (
        <div className={styles.startup} role="status" style={startupStyle}>
            <div aria-hidden="true" className={styles.content}>
                <span className={styles.brand}>PLANEAT</span>
                <span className={styles.spinner} />
            </div>
            <span className={styles.visuallyHidden}>Loading Planeat</span>
        </div>
    );
}
