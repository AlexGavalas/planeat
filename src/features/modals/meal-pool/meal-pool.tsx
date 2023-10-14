import { Tabs } from '@mantine/core';
import { type ContextModalProps } from '@mantine/modals';
import { useCallback } from 'react';

import { FileUploadTab } from './file-upload';
import { ManualInputTab } from './manual-input';

export const MealPoolModal = ({ context, id }: ContextModalProps) => {
    const closeModal = useCallback(() => {
        context.closeContextModal(id);
    }, [context, id]);

    return (
        <Tabs defaultValue="manually">
            <Tabs.List mb="md" mt="sm">
                <Tabs.Tab value="manually">Meal Pool</Tabs.Tab>
                <Tabs.Tab value="automatic">Import files</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="manually">
                <ManualInputTab onDone={closeModal} />
            </Tabs.Panel>
            <Tabs.Panel value="automatic">
                <FileUploadTab />
            </Tabs.Panel>
        </Tabs>
    );
};
