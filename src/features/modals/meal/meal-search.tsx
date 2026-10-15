import { List, Text, TextInput } from '@mantine/core';
import type { ReactElement } from 'react';
import { type ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { type MealTemplate } from '~types/meal-pool';

import { MealResult, type OnMealEdit } from './meal-result';

type MealSearchProps = Readonly<{
    onEdit: OnMealEdit;
    onSearchChange: ChangeEventHandler<HTMLInputElement>;
    results: {
        client: MealTemplate[];
        own: MealTemplate[];
    };
    showClientMeals: boolean;
}>;

export const MealSearch = ({
    onEdit,
    onSearchChange,
    results,
    showClientMeals,
}: MealSearchProps): ReactElement => {
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
                        key={result.id}
                        template={result}
                        onEdit={onEdit}
                    />
                ))}
            </List>
            {results.own.length === 0 && (
                <Text c="dimmed" mt="xs" size="sm">
                    {t('modals.meal_edit.no_saved_meals')}
                </Text>
            )}
            {showClientMeals && (
                <>
                    <Text fw="var(--mantine-font-weight-semibold)" mt="md">
                        {t('professional.meal_pool.client')}
                    </Text>
                    <List withPadding mt="xs" spacing="md">
                        {results.client.map((result) => (
                            <MealResult
                                key={result.id}
                                template={result}
                                onEdit={onEdit}
                            />
                        ))}
                    </List>
                    {results.client.length === 0 && (
                        <Text c="dimmed" mt="xs" size="sm">
                            {t('modals.meal_edit.no_client_meals')}
                        </Text>
                    )}
                </>
            )}
        </>
    );
};
