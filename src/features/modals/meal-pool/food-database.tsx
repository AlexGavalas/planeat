import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { type MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type EditedMealItem } from '~types/meal';
import { foodToMealItem } from '~util/nutrition';

import { FoodDatabaseSearch } from '../meal/food-database-search';
import { MealItemsEditor } from '../meal/meal-items-editor';
import { useCreateMealPool } from './hooks/use-create-meal-pool';

type FoodDatabaseTabProps = Readonly<{
    onDone: () => void;
}>;

export const FoodDatabaseTab = ({ onDone }: FoodDatabaseTabProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState('');
    const [items, setItems] = useState<EditedMealItem[]>([]);
    const {
        mutate,
        isPending: isLoading,
        error,
        reset: resetCreationState,
    } = useCreateMealPool({ onSuccess: onDone });

    const handleCreate = (() => {
        mutate({ templates: [{ content: preview, items }] });
    }) satisfies MouseEventHandler<HTMLButtonElement>;
    const handleFoodSelect = (food: Parameters<typeof foodToMealItem>[0]) => {
        setItems((current) => [
            ...current,
            foodToMealItem(food, current.length),
        ]);
        if (!preview) {
            setPreview([food.brand, food.name].filter(Boolean).join(' '));
        }
    };
    const handlePreviewChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPreview(event.target.value);
    };
    const handleItemsChange = (nextItems: EditedMealItem[]) => {
        setItems(nextItems);
    };

    return (
        <Stack gap="md">
            <FoodDatabaseSearch onSelect={handleFoodSelect} />
            <Stack gap="sm">
                <Text>{t('generic.actions.preview')}</Text>
                <TextInput
                    withAsterisk
                    error={error instanceof Error && error.message}
                    label={t('meal_label')}
                    onChange={handlePreviewChange}
                    onFocus={resetCreationState}
                    value={preview}
                />
                <MealItemsEditor
                    items={items}
                    onItemsChange={handleItemsChange}
                />
            </Stack>
            <Group gap="md" justify="end">
                <Button color="danger" disabled={isLoading} onClick={onDone}>
                    {t('generic.actions.cancel')}
                </Button>
                <Button loading={isLoading} onClick={handleCreate}>
                    {t('generic.actions.save')}
                </Button>
            </Group>
        </Stack>
    );
};
