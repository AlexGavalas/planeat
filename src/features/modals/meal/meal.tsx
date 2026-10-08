import {
    Button,
    Group,
    List,
    Stack,
    Tabs,
    Text,
    TextInput,
    Textarea,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { type ContextModalProps } from '@mantine/modals';
import {
    type ChangeEventHandler,
    type MouseEventHandler,
    type SubmitEventHandler,
    useCallback,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useFeatureFlags } from '~features/feature-flags';
import { useProfile } from '~hooks/use-profile';

import { useGetMealPool } from '../meal-pool/hooks/use-get-meal-pool';
import { FoodDatabaseSearch } from './food-database-search';

type MealModalProps = {
    onDelete: () => Promise<void> | void;
    onSave: (meal: string) => Promise<void> | void;
    initialMeal: string;
    ownerUserId?: number;
};

type OnEdit = (params: string) => void;

type MealResultProps = Readonly<{
    mealText: string;
    onEdit: OnEdit;
}>;

const MealResult = ({ mealText, onEdit }: MealResultProps) => {
    const { t } = useTranslation();

    const handleEdit = useCallback<MouseEventHandler<HTMLButtonElement>>(() => {
        onEdit(mealText);
    }, [onEdit, mealText]);

    return (
        <List.Item>
            {mealText}{' '}
            <Button onClick={handleEdit} size="compact-xs">
                {t('generic.actions.edit')}
            </Button>
        </List.Item>
    );
};

export const MealModal = ({
    context,
    id,
    innerProps: { initialMeal, onDelete, onSave, ownerUserId },
}: ContextModalProps<MealModalProps>) => {
    const { t } = useTranslation();
    const { isFoodDatabaseSearchEnabled } = useFeatureFlags();
    const { profile } = useProfile();
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(initialMeal);
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

    const closeModal = useCallback(() => {
        context.closeContextModal(id);
    }, [context, id]);

    const resetError = useCallback(() => {
        setError('');
    }, []);

    const handleSubmit = useCallback<SubmitEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault();

            const meal = preview;

            if (!meal) {
                setError(t('errors.meal_empty'));
                return;
            }

            await onSave(meal);

            closeModal();
        },
        [closeModal, preview, onSave, t],
    );

    const handleDelete = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        await onDelete();
        closeModal();
    }, [closeModal, onDelete]);

    const handleSearchChange = useCallback<
        ChangeEventHandler<HTMLInputElement>
    >((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleEdit = useCallback<OnEdit>((previewText) => {
        setPreview(previewText);
    }, []);

    const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
        (e) => {
            setPreview(e.target.value);
        },
        [],
    );

    const mealSearch = (
        <>
            <TextInput
                label={t('generic.search.label')}
                onChange={handleSearchChange}
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
                        onEdit={handleEdit}
                    />
                ))}
            </List>
            {shouldIncludeClient && (
                <>
                    <Text fw="var(--mantine-font-weight-semibold)" mt="md">
                        {t('professional.meal_pool.client')}
                    </Text>
                    <List withPadding mt="xs" spacing="md">
                        {results.client.map((result) => (
                            <MealResult
                                key={result}
                                mealText={result}
                                onEdit={handleEdit}
                            />
                        ))}
                    </List>
                </>
            )}
        </>
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
                            <FoodDatabaseSearch onSelect={handleEdit} />
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
