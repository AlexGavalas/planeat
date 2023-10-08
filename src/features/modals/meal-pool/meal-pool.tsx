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
    type MouseEventHandler,
    memo,
    useCallback,
    useState,
} from 'react';

import { useCreateMealPool } from './hooks/use-create-meal-pool';
import { useGetMealPool } from './hooks/use-get-meal-pool';

type OnEdit = (params: string) => void;

type MealResultProps = {
    mealText: string;
    onEdit: OnEdit;
};

const MealResult = memo(({ mealText, onEdit }: MealResultProps) => {
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
});

MealResult.displayName = 'MealResult';

export const MealPoolModal = ({ context, id }: ContextModalProps) => {
    const { t } = useTranslation();
    const [preview, setPreview] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 350);

    const { data: results = [] } = useGetMealPool({
        searchQuery: debouncedSearchQuery,
    });

    const closeModal = useCallback(() => {
        context.closeContextModal(id);
    }, [context, id]);

    const {
        mutate,
        isLoading,
        error,
        reset: resetCreationState,
    } = useCreateMealPool({
        onSuccess: closeModal,
    });

    const handleCreate = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        mutate({ content: preview });
    }, [preview]);

    const handleEdit = useCallback<OnEdit>((previewText) => {
        setPreview(previewText);
    }, []);

    const handlePreviewChange = useCallback<
        ChangeEventHandler<HTMLTextAreaElement>
    >((e) => {
        setPreview(e.currentTarget.value);
    }, []);

    const handleSearchChange = useCallback<
        ChangeEventHandler<HTMLInputElement>
    >((e) => {
        setSearchQuery(e.currentTarget.value);
    }, []);

    return (
        <Stack gap="md">
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
            <Stack gap="md">
                <Text>{t('generic.actions.preview')}</Text>
                <Textarea
                    autosize
                    withAsterisk
                    error={error instanceof Error && error.message}
                    minRows={3}
                    onChange={handlePreviewChange}
                    onFocus={resetCreationState}
                    value={preview}
                />
            </Stack>
            <Group gap="md" justify="end">
                <Button color="red" disabled={isLoading} onClick={closeModal}>
                    {t('generic.actions.cancel')}
                </Button>
                <Button loading={isLoading} onClick={handleCreate}>
                    {t('generic.actions.save')}
                </Button>
            </Group>
        </Stack>
    );
};
