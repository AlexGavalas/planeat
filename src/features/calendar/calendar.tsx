import { Space } from '@mantine/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
            <DndProvider backend={HTML5Backend}>
                <Content />
            </DndProvider>
        </section>
    );
};
