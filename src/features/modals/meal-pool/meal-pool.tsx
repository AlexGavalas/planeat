import { Tabs } from '@mantine/core';
import { type ContextModalProps } from '@mantine/modals';
import { useTranslation } from 'react-i18next';

import { useFeatureFlags } from '~features/feature-flags';

import { FileUploadTab } from './file-upload';
import { FoodDatabaseTab } from './food-database';
import { ManualInputTab } from './manual-input';

export const MealPoolModal = ({ context, id }: ContextModalProps) => {
    const { t } = useTranslation();
    const { isFoodDatabaseSearchEnabled } = useFeatureFlags();
    const closeModal = () => {
        context.closeContextModal(id);
    };

    return (
        <Tabs defaultValue="manually">
            <Tabs.List mb="md" mt="sm">
                <Tabs.Tab value="manually">
                    {t('modals.meal_pool.tabs.manual')}
                </Tabs.Tab>
                {isFoodDatabaseSearchEnabled && (
                    <Tabs.Tab value="food-database">
                        {t('modals.meal_pool.tabs.food_database')}
                    </Tabs.Tab>
                )}
                <Tabs.Tab value="automatic">
                    {t('modals.meal_pool.tabs.import')}
                </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="manually">
                <ManualInputTab onDone={closeModal} />
            </Tabs.Panel>
            <Tabs.Panel value="automatic">
                <FileUploadTab />
            </Tabs.Panel>
            {isFoodDatabaseSearchEnabled && (
                <Tabs.Panel value="food-database">
                    <FoodDatabaseTab onDone={closeModal} />
                </Tabs.Panel>
            )}
        </Tabs>
    );
};
