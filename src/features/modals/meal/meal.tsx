import { Button, Group, Stack, Tabs, Text, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { type ContextModalProps } from '@mantine/modals';
import {
    type ChangeEventHandler,
    type MouseEventHandler,
    type SubmitEventHandler,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useFeatureFlags } from '~features/feature-flags';
import { useProfile } from '~hooks/use-profile';
import { type FoodSearchResult } from '~types/food-search';
import { type EditedMealItem } from '~types/meal';
import { foodToMealItem } from '~util/nutrition';

import { useGetMealPool } from '../meal-pool/hooks/use-get-meal-pool';
import { FoodDatabaseSearch } from './food-database-search';
import { MealItemsEditor } from './meal-items-editor';
import { type OnMealEdit } from './meal-result';
import { MealSearch } from './meal-search';

type MealModalProps = {
    onDelete: () => Promise<void> | void;
    initialItems?: EditedMealItem[];
    onSave: (meal: string, items: EditedMealItem[]) => Promise<void> | void;
    initialMeal: string;
    ownerUserId?: number;
};

export const MealModal = ({
    context,
    id,
    innerProps: {
        initialItems = [],
        initialMeal,
        onDelete,
        onSave,
        ownerUserId,
    },
}: ContextModalProps<MealModalProps>) => {
    const { t } = useTranslation();
    const { isFoodDatabaseSearchEnabled } = useFeatureFlags();
    const { profile } = useProfile();
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(initialMeal);
    const [items, setItems] = useState<EditedMealItem[]>(initialItems);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 350);

    const shouldIncludeClient = Boolean(
        ownerUserId && profile?.id && ownerUserId !== profile.id,
    );
    const { data = [] } = useGetMealPool({
        includeClient: shouldIncludeClient,
        ownerUserId,
        searchQuery: debouncedSearchQuery,
    });
    const results = Array.isArray(data) ? { client: [], own: data } : data;

    const closeModal = () => {
        context.closeContextModal(id);
    };

    const resetError = () => {
        setError('');
    };

    const handleSubmit = (async (e) => {
        e.preventDefault();

        const meal = preview;

        if (!meal) {
            setError(t('errors.meal_empty'));
            return;
        }

        await onSave(meal, items);

        closeModal();
    }) satisfies SubmitEventHandler<HTMLFormElement>;

    const handleDelete = (async () => {
        await onDelete();
        closeModal();
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    const handleSearchChange = ((e) => {
        setSearchQuery(e.target.value);
    }) satisfies ChangeEventHandler<HTMLInputElement>;

    const handleEdit = ((template) => {
        setPreview(template.content);
        setItems(template.items.map(({ id: _id, ...item }) => ({ ...item })));
    }) satisfies OnMealEdit;

    const handleFoodSelect = (food: FoodSearchResult) => {
        setItems((current) => [
            ...current,
            foodToMealItem(food, current.length),
        ]);
        if (!preview) {
            setPreview([food.brand, food.name].filter(Boolean).join(' '));
        }
    };

    const handleChange = ((e) => {
        setPreview(e.target.value);
    }) satisfies ChangeEventHandler<HTMLTextAreaElement>;
    const handleItemsChange = (nextItems: EditedMealItem[]) => {
        setItems(nextItems);
    };

    const mealSearch = (
        <MealSearch
            onEdit={handleEdit}
            onSearchChange={handleSearchChange}
            results={results}
            showClientMeals={shouldIncludeClient}
        />
    );

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="sm">
                <Text>
                    {t(
                        isFoodDatabaseSearchEnabled
                            ? 'modals.meal_edit.helper'
                            : 'modals.meal_edit.helper_without_food_database',
                    )}
                </Text>
                {isFoodDatabaseSearchEnabled ? (
                    <Tabs defaultValue="my-meals">
                        <Tabs.List>
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
                            <FoodDatabaseSearch onSelect={handleFoodSelect} />
                        </Tabs.Panel>
                    </Tabs>
                ) : (
                    mealSearch
                )}
                <Textarea
                    autosize
                    error={error}
                    label={t('meal_label')}
                    maxRows={20}
                    minRows={5}
                    name="meal"
                    onChange={handleChange}
                    onFocus={resetError}
                    placeholder={t('meal_placeholder')}
                    value={preview}
                />
                <MealItemsEditor
                    items={items}
                    onItemsChange={handleItemsChange}
                />

                <Group justify="space-between">
                    <Button color="danger" onClick={closeModal} variant="light">
                        {t('generic.actions.cancel')}
                    </Button>
                    <Group gap="md">
                        {initialMeal && (
                            <Button color="danger" onClick={handleDelete}>
                                {t('generic.actions.delete')}
                            </Button>
                        )}
                        <Button type="submit">
                            {t('generic.actions.save')}
                        </Button>
                    </Group>
                </Group>
            </Stack>
        </form>
    );
};
