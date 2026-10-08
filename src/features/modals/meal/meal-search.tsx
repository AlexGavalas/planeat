import { List, Text, TextInput } from '@mantine/core';
import { type ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { MealResult, type OnMealEdit } from './meal-result';

type MealSearchProps = Readonly<{
    onEdit: OnMealEdit;
    onSearchChange: ChangeEventHandler<HTMLInputElement>;
    results: {
        client: string[];
        own: string[];
    };
    showClientMeals: boolean;
}>;

export const MealSearch = ({
    onEdit,
    onSearchChange,
    results,
    showClientMeals,
}: MealSearchProps) => {
    const { t } = useTranslation();

    return (
        <>
            <TextInput
                label={t('generic.search.label')}
                onChange={onSearchChange}
                placeholder={t('generic.search.placeholder')}
            />

            <Text fw="var(--mantine-font-weight-semibold)" mt="sm">
                {t('professional.meal_pool.own')}
            </Text>
            <List withPadding mt="xs" spacing="md">
                {results.own.map((result) => (
                    <MealResult
                        key={result}
                        mealText={result}
                        onEdit={onEdit}
                    />
                ))}
            </List>
            {showClientMeals && (
                <>
                    <Text fw="var(--mantine-font-weight-semibold)" mt="md">
                        {t('professional.meal_pool.client')}
                    </Text>
                    <List withPadding mt="xs" spacing="md">
                        {results.client.map((result) => (
                            <MealResult
                                key={result}
                                mealText={result}
                                onEdit={onEdit}
                            />
                        ))}
                    </List>
                </>
            )}
        </>
    );
};
