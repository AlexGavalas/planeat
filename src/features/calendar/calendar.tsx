import { Space } from '@mantine/core';

import { Card } from '~components/card';
import { LoadingOverlay } from '~components/loading-overlay';
import { useMeals } from '~store/hooks';

import styles from './calendar.module.css';
import { Content } from './content';
import { Controls } from './controls';
import { Header } from './header';

export const Calendar = () => {
    const { loading } = useMeals();

    return (
        <section className={styles.container}>
            <LoadingOverlay visible={loading} />
            <Controls />
            <Space h="md" />
            <Header />
            <Card>
                <Content />
            </Card>
        </section>
    );
};
