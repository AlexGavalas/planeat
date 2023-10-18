import {
    Button,
    Group,
    List,
    Stack,
    Text,
    TextInput,
    Textarea,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { type ContextModalProps } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import {
    type ChangeEventHandler,
    type FormEventHandler,
    type MouseEventHandler,
    useCallback,
    useState,
} from 'react';

import { useGetMealPool } from '../meal-pool/hooks/use-get-meal-pool';

type MealModalProps = {
    onDelete: () => Promise<void> | void;
    onSave: (meal: string) => Promise<void> | void;
    initialMeal: string;
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
    innerProps: { initialMeal, onDelete, onSave },
}: ContextModalProps<MealModalProps>) => {
    const { t } = useTranslation();
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(initialMeal);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 350);

    const { data: results = [] } = useGetMealPool({
        searchQuery: debouncedSearchQuery,
    });

    const closeModal = useCallback(() => {
        context.closeContextModal(id);
    }, [context, id]);

    const resetError = useCallback(() => {
        setError('');
    }, []);

    const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
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
        setSearchQuery(e.currentTarget.value);
    }, []);

    const handleEdit = useCallback<OnEdit>((previewText) => {
        setPreview(previewText);
    }, []);

    const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
        (e) => {
            setPreview(e.currentTarget.value);
        },
        [],
    );

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="sm">
                <Text>{t('modals.meal_edit.helper')}</Text>
                <TextInput
                    label={t('generic.search.label')}
                    onChange={handleSearchChange}
                    placeholder={t('generic.search.placeholder')}
                />
                <List withPadding spacing="md">
                    {results.map((result) => (
                        <MealResult
                            key={result}
                            mealText={result}
                            onEdit={handleEdit}
                        />
                    ))}
                </List>
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
                    <Button color="red" onClick={closeModal} variant="light">
                        {t('generic.actions.cancel')}
                    </Button>
                    <Group gap="md">
                        {initialMeal && (
                            <Button color="red" onClick={handleDelete}>
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
