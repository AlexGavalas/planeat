import styles from './meal.module.css';

export const MEAL_MODAL_OPTIONS = {
    centered: true,
    classNames: {
        body: styles.modalBody,
        content: styles.modalContent,
        header: styles.modalHeader,
        inner: styles.modalInner,
    },
    size: '72rem',
    transitionProps: { duration: 200, transition: 'fade' },
} as const;
