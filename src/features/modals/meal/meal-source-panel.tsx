import { Paper, Stack, Tabs, Text, Title } from '@mantine/core';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { type FoodSearchResult } from '~types/food-search';

import { FoodDatabaseSearch } from './food-database-search';
import styles from './meal.module.css';

type Props = Readonly<{
    foodDatabaseEnabled: boolean;
    mealSearch: ReactNode;
    onFoodSelect: (food: FoodSearchResult) => void;
}>;

export const MealSourcePanel = ({
    foodDatabaseEnabled,
    mealSearch,
    onFoodSelect,
}: Props) => {
    const { t } = useTranslation();

    return (
        <Paper className={styles.sourcePanel} p="md" withBorder>
            <Stack gap="sm">
                <div>
                    <Title order={3} size="h4">
                        {t('modals.meal_edit.source.title')}
                    </Title>
                    <Text c="dimmed" size="sm">
                        {t(
                            foodDatabaseEnabled
                                ? 'modals.meal_edit.helper'
                                : 'modals.meal_edit.helper_without_food_database',
                        )}
                    </Text>
                </div>
                {foodDatabaseEnabled ? (
                    <Tabs defaultValue="my-meals">
                        <Tabs.List grow>
                            <Tabs.Tab value="my-meals">
                                {t('modals.meal_edit.my_meals')}
                            </Tabs.Tab>
                            <Tabs.Tab value="food-database">
                                {t('modals.meal_edit.food_search.tab')}
                            </Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel pt="sm" value="my-meals">
                            {mealSearch}
                        </Tabs.Panel>
                        <Tabs.Panel pt="sm" value="food-database">
                            <FoodDatabaseSearch onSelect={onFoodSelect} />
                        </Tabs.Panel>
                    </Tabs>
                ) : (
                    mealSearch
                )}
            </Stack>
        </Paper>
    );
};
